package pwr.inf.ziwg.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "conversation")
    @JsonIgnore
    private Request request;

    private String watsonId;
    private String intent;

    public Conversation() {

    }

    public Conversation(Long id, Request request, String watsonId, String intent) {
        this.id = id;
        this.request = request;
        this.watsonId = watsonId;
        this.intent = intent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
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
}
