package pwr.inf.ziwg.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pwr.inf.ziwg.chatbot.domain.Document;
import pwr.inf.ziwg.chatbot.repository.DocumentRepository;

import java.util.*;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    public Document addNewDocument(Document document) {
        repository.save(document);
        return document;
    }

    public Document getDocumentType(String query) {
        List<Document> documentList = new ArrayList<>();
        repository.findAll().forEach(documentList::add);

        Optional<Document> match = documentList.stream()
                .filter(document -> getNumbOfCommonElements(document.getKeywords(), query) > 1)
                .sorted(Comparator.comparingInt(document -> getNumbOfCommonElements(document.getKeywords(), query)))
                .findFirst();

        return match.isPresent() ? match.get() : null;
    }

    private int getNumbOfCommonElements(String s1, String s2) {
        String[] c = s1.toLowerCase().split(" ");
        String[] d = s2.toLowerCase().split(" ");

        Set<String> hset = new LinkedHashSet<>();

        for (int i = 0; i < c.length; i++) {
            for (int j = 0; j < d.length; j++) {
                if (c[i] == d[j]) {
                    hset.add(c[i]);
                }
            }
        }

        return hset.size();
    }

}
