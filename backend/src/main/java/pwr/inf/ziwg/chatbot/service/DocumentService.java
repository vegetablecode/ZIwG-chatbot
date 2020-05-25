package pwr.inf.ziwg.chatbot.service;

import com.google.gson.JsonObject;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pwr.inf.ziwg.chatbot.domain.*;
import pwr.inf.ziwg.chatbot.repository.ConversationRepository;
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
    private ConversationRepository conversationRepository;

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
        query = query.replaceAll("[-+.^:,?]", "");
        List<Document> documentList = new ArrayList<>();
        repository.findAll().forEach(documentList::add);

        String finalQuery = query;
        Optional<Document> match = documentList.stream()
                .filter(document -> getNumbOfCommonElements(document.getKeywords(), finalQuery) > 0)
                .sorted((o1, o2) -> getNumbOfCommonElements(o2.getKeywords(), finalQuery)
                        - (getNumbOfCommonElements(o1.getKeywords(), finalQuery)))
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
            String urlKey = key.replace(" ", "%20");
            endpoint = endpoint.replace("{{" + urlKey + "}}", params.getOrDefault(key, ""));
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
//            response.put("res ", httpResponse.getBody().getObject());
//            System.out.println(response.toString());
            response = httpResponse.getBody().getObject();
            System.out.println("HTTP__RESPONSE: " + response.toString());
        }

        System.out.println("response -> " + response.toString());

        return response;
    }

    private JSONObject getResponseFromDocumentContainer(String key) throws UnirestException {
        JSONObject response = new JSONObject();

        HashMap<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        String containerEndpoint = "https://serverless-chatbot-m08jik8es.now.sh/api/getDocument";
        JsonObject jsonBody = new JsonObject();
        jsonBody.addProperty("key", key);
        String body = jsonBody.toString();
        System.out.println("DOC_CONTAINER_BODY: " + body);

        HttpResponse<JsonNode> httpResponse = null;
        int i = 0;
        boolean responseFound = false;
        while (!responseFound) {
            System.out.println("-try");
            i++;
            httpResponse = Unirest.post(containerEndpoint).headers(headers).body(body).asJson();
            if (httpResponse.getBody() != null) {
                if (httpResponse.getBody().getObject() != null) {
                    if (httpResponse.getBody().getObject().has("document")) {
                        responseFound = true;
                    }
                }
            }
            if (i > 10) break;
        }

        System.out.println("RES IS HERE: " + httpResponse.getBody().toString());

        if (httpResponse != null && httpResponse.getBody().getObject().has("document")) {
            response = httpResponse.getBody().getObject().getJSONObject("document");
            System.out.println("DOC_CONTAINER_RES: " + response);
        }


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
                if (node.has(key.substring(0, key.indexOf("[")))) {
                    node = node.getJSONArray(key.substring(0, key.indexOf("["))).getJSONObject(id);
                } else {
                    return "<i>Cannot find any matching item in given array. Check the template</i>";
                }
            } else {
                if (node.has(key)) {
                    node = node.getJSONObject(key);
                } else {
                    return "<i>Cannot find any matching this key. Check the template</i>";
                }
            }
        }
        System.out.println(node.toString());

        if(!node.has(parameter)) {
            return "<i>Cannot find matching parameter. Check the template</i>";
        }

        return node.getString(parameter);
    }

    private String addImageLoading(String template) {
        return template.replaceAll("<img ", "<img onLoad={this.handleImageLoaded} ");
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
            template = addImageLoading(template);
        }

        System.out.println("parsed: " + template);
        return template;
    }

    public String getDocument(Request request, String name) throws UnirestException {
        String response = "";

        Map<String, String> paramsMap = getParamsMap(request.getConversation().getDocument().getParams(), request.getResponse().getParams());
        paramsMap.put("user", name);

        Document document = request.getConversation().getDocument();

        switch (request.getConversation().getDocument().getType()) {
            case "API":
                JSONObject apiResponse = getResponseFromAPI(document.getMethod(), document.getEndpoint(), document.getBody(), paramsMap, document.getHeaders());
                response = parseResponse(apiResponse, document.getTemplate());
                break;
            case "ZAPIER":
                String key = generateRandomKey();
                String zapierBody = generateZapierBody(paramsMap, key);
                JSONObject webhookResponse = getResponseFromAPI(document.getMethod(), document.getEndpoint(), zapierBody, paramsMap, document.getHeaders());

                JSONObject documentContainerResponse = getResponseFromDocumentContainer(key);
                response = parseResponse(documentContainerResponse, document.getTemplate());
                break;
            default:
                response = "Cannot determine document type";
        }

        return response;
    }

    private String generateZapierBody(Map<String, String> paramsMap, String key) {
        paramsMap.put("key", key);
        JsonObject jsonBody = new JsonObject();
        for (String item : paramsMap.keySet()) {
            jsonBody.addProperty(item, paramsMap.get(item));
        }
        System.out.println("GENERATED_ZAPIER_BODY: " + jsonBody.toString());
        return jsonBody.toString();
    }

    private String generateRandomKey() {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        return generatedString;
    }

    public List<Document> getAllDocuments() {
        return repository.findAll();
    }

    public Optional<Document> getRequestedDocument(String id) {
        return repository.findById(Long.parseLong(id));
    }

    public void removeDocument(String id) {
        Long index = Long.parseLong(id);
        Iterable<Conversation> conversations = conversationRepository.findAll();
        for (Conversation conversation : conversations) {
            if (conversation.getDocument().getId().equals(index)) {
                conversation.setDocument(null);
                conversationRepository.save(conversation);
            }
        }
        repository.deleteById(Long.parseLong(id));
    }
}
