package pwr.inf.ziwg.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pwr.inf.ziwg.chatbot.domain.Document;
import pwr.inf.ziwg.chatbot.domain.DocumentParameter;
import pwr.inf.ziwg.chatbot.domain.Request;
import pwr.inf.ziwg.chatbot.repository.DocumentParameterRepository;
import pwr.inf.ziwg.chatbot.repository.DocumentRepository;

import java.util.*;
import java.util.stream.IntStream;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    @Autowired
    private DocumentParameterRepository documentParameterRepository;

    public Document addNewDocument(Document document) {
        Document savedDocument = repository.save(document);
        for(DocumentParameter p : document.getParams()) {
            p.setDocument(savedDocument);
            documentParameterRepository.save(p);
        }
        return document;
    }

    public Optional<Document> getDocumentType(String query) {
        List<Document> documentList = new ArrayList<>();
        repository.findAll().forEach(documentList::add);

        Optional<Document> match = documentList.stream()
                .filter(document -> getNumbOfCommonElements(document.getKeywords(), query) > 1)
                .sorted((o1, o2) -> getNumbOfCommonElements(o2.getKeywords(), query)
                        -(getNumbOfCommonElements(o1.getKeywords(), query)))
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

        if(!document.getParams().isEmpty()) {
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

    public String getDocument(Request request) {
        return "im here";
    }
}
