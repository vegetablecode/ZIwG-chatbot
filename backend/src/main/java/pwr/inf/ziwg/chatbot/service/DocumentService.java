package pwr.inf.ziwg.chatbot.service;

import com.google.gson.JsonObject;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import okhttp3.Headers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pwr.inf.ziwg.chatbot.domain.Document;
import pwr.inf.ziwg.chatbot.domain.DocumentParameter;
import pwr.inf.ziwg.chatbot.domain.Header;
import pwr.inf.ziwg.chatbot.domain.Request;
import pwr.inf.ziwg.chatbot.repository.DocumentParameterRepository;
import pwr.inf.ziwg.chatbot.repository.DocumentRepository;
import pwr.inf.ziwg.chatbot.repository.HeaderRepository;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.IntStream;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    @Autowired
    private DocumentParameterRepository documentParameterRepository;

    @Autowired
    private HeaderRepository headerRepository;

    public Document addNewDocument(Document document) {
        Document savedDocument = repository.save(document);

        for (DocumentParameter p : document.getParams()) {
            p.setDocument(savedDocument);
            documentParameterRepository.save(p);
        }

        for (Header h : document.getHeaders()) {
            h.setDocument(savedDocument);
            headerRepository.save(h);
        }
        return document;
    }

    public Optional<Document> getDocumentType(String query) {
        List<Document> documentList = new ArrayList<>();
        repository.findAll().forEach(documentList::add);

        Optional<Document> match = documentList.stream()
                .filter(document -> getNumbOfCommonElements(document.getKeywords(), query) > 1)
                .sorted((o1, o2) -> getNumbOfCommonElements(o2.getKeywords(), query)
                        - (getNumbOfCommonElements(o1.getKeywords(), query)))
                .findFirst();

        return match;
    }

    private int getNumbOfCommonElements(String s1, String s2) {
        String[] c = s1.toLowerCase().split(" ");
        String[] d = s2.toLowerCase().split(" ");
        int counter = 0;

        for (int i = 0; i < c.length; i++) {
            for (int j = 0; j < d.length; j++) {
                if (c[i].equals(d[j])) {
                    counter++;
                }
            }
        }

        return counter;
    }

    public String mapResponse(String prevMessage, Document document) {
        Map<String, String> params = new HashMap<>();

        if (!document.getParams().isEmpty()) {
            IntStream.range(0, document.getParams().size()).forEach(idx ->
                    params.put("{{param" + (idx + 1) + "}}", document.getParams().get(idx).getLabel()
                    ));
            for (String key : params.keySet()) {
                if (prevMessage.contains(key)) {
                    return prevMessage.replace(key, params.get(key));
                }
            }
        }

        return "";
    }

    private Map<String, String> getParamsMap(List<DocumentParameter> documentParams, Map<String, String> userParams) {
        Map<String, String> resultMap = new HashMap<>();

        for (int i = 0; i < userParams.keySet().size(); i++) {
            resultMap.put(documentParams.get(i).getLabel(), userParams.get("param" + (i + 1)));
        }
        return resultMap;
    }

    private JSONObject getResponseFromAPI(String method, String endpoint, String body, Map<String, String> params, List<Header> headers) throws UnirestException {
        JSONObject response = new JSONObject();

        Map<String, String> headerMap = new HashMap<>();
        headers.stream().forEach(header -> headerMap.put(header.getKey(), header.getValue()));

        System.out.println(params.toString());

        for (String key : params.keySet()) {
            endpoint = endpoint.replace("{{" + key + "}}", params.getOrDefault(key, ""));
            body = body.replace("{{" + key + "}}", params.getOrDefault(key, ""));
        }

        System.out.println(endpoint);
        System.out.println(body);

        HttpResponse<JsonNode> httpResponse = null;

        switch (method) {
            case "GET":
                httpResponse = Unirest.get(endpoint).headers(headerMap).asJson();
                break;
            case "POST":
                httpResponse = Unirest.post(endpoint).headers(headerMap).body(body).asJson();
                break;
            default:
                response.put("message", "Cannot read HTTP method");
        }

        if (httpResponse != null) {
            response = httpResponse.getBody().getObject();
        }

        System.out.println("response -> " + response.toString());

        return response;
    }

    private String removeBrackets(String str) {
        return str.replaceAll("\\{\\{(.*)\\}\\}", "$1");
    }

    private String getValueFromJson(JSONObject json, String location) {
        List<String> keys = new LinkedList<String>(Arrays.asList(location.split("\\.")));
        String parameter = keys.get(keys.size() - 1);

        keys.stream().forEach(k -> System.out.println(k));

        System.out.println("last: " + parameter);

        keys.remove(keys.size() - 1);

        JSONObject node = json;

        for (String key : keys) {
            Pattern pattern = Pattern.compile("(([a-z]|[A-Z]|[0-9]| |_)+)\\[[0-9]+\\]");
            Matcher m = pattern.matcher(key);

            if (m.find()) {
                int id = Integer.parseInt(key.substring(key.indexOf("[") + 1, key.indexOf("]")));
                node = node.getJSONArray(key.substring(0, key.indexOf("["))).getJSONObject(id);
            } else {
                node = node.getJSONObject(key);
            }
        }
        System.out.println(node.toString());

        return node.getString(parameter);
    }

    private String parseResponse(JSONObject response, String template) {
        System.out.println("parse START");
        System.out.println("template: " + template);
        List<String> allMatches = new ArrayList<>();
        Matcher m = Pattern.compile("(\\{\\{([a-z]|[A-Z]|[0-9]| |_|\\.|(\\[[0-9]+\\]))+\\}\\})+")
                .matcher(template);
        while (m.find()) {
            allMatches.add(m.group());
        }

        for (String matcher : allMatches) {
            System.out.println(matcher);
            template = template.replace(matcher, getValueFromJson(response, removeBrackets(matcher)));
        }

        System.out.println("parsed: " + template);
        return template;
    }

    public String getDocument(Request request) throws UnirestException {
        String response = "";

        Map<String, String> paramsMap = getParamsMap(request.getConversation().getDocument().getParams(), request.getResponse().getParams());

        Document document = request.getConversation().getDocument();

        switch (request.getConversation().getDocument().getType()) {
            case "API":
                JSONObject apiResponse = getResponseFromAPI(document.getMethod(), document.getEndpoint(), document.getBody(), paramsMap, document.getHeaders());
                response = parseResponse(apiResponse, document.getTemplate());
                break;
            default:
                response = "Cannot determine document type";
        }

        return response;
    }
}
