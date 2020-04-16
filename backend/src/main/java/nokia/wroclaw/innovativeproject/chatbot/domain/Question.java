package nokia.wroclaw.innovativeproject.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "question")
    @JsonIgnore
    private Request request;

    @NotBlank(message = "Question is required.")
    private String query;
    private String intent;
    private double confidence;

    public Question() {
    }

    public Question(Long id, Request request, @NotBlank(message = "Question is required.") String query, String intent, double confidence) {
        this.id = id;
        this.request = request;
        this.query = query;
        this.intent = intent;
        this.confidence = confidence;
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

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}
