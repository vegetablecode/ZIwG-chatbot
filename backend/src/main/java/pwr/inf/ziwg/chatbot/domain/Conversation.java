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

    @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER, mappedBy = "conversation", orphanRemoval = true)
    @JsonIgnore
    private List<Request> requests = new ArrayList<>();

    private String watsonId;
    private String intent;

    public Conversation() {

    }

    public Conversation(Long id, List<Request> requests, String watsonId, String intent) {
        this.id = id;
        this.requests = requests;
        this.watsonId = watsonId;
        this.intent = intent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Request> getRequests() {
        return requests;
    }

    public void setRequests(List<Request> requests) {
        this.requests = requests;
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
