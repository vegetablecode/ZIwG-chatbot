package pwr.inf.ziwg.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String watsonId;
    private String intent;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    public Conversation() {

    }

    public Conversation(Long id, String watsonId, String intent, Document document) {
        this.id = id;
        this.watsonId = watsonId;
        this.intent = intent;
        this.document = document;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWatsonId() {
        return watsonId;
    }

    public void setWatsonId(String watsonId) {
        this.watsonId = watsonId;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
}
