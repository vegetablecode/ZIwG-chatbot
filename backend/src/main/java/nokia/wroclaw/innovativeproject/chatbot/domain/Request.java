package nokia.wroclaw.innovativeproject.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.*;

@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // request
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id", referencedColumnName = "id")
    private Question question;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyy HH:mm")
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    private String requestOwner;

    // response
    private String responseText;
    private String responseType; // "" means text
    private String responseRating;

    @ElementCollection
    @CollectionTable(name="RESPONSE_PARAMS")
    @MapKeyColumn(name="PARAMS")
    private Map<String, String> responseParams = new HashMap<>();

    // conversation
    private String conversationId;
    private String conversationIntent;

    public Request() {

    }

    public Request(Long id, Question question, Date date, User user, String requestOwner, String responseText, String responseType, String responseRating, Map<String, String> responseParams, String conversationId, String conversationIntent) {
        this.id = id;
        this.question = question;
        this.date = date;
        this.user = user;
        this.requestOwner = requestOwner;
        this.responseText = responseText;
        this.responseType = responseType;
        this.responseRating = responseRating;
        this.responseParams = responseParams;
        this.conversationId = conversationId;
        this.conversationIntent = conversationIntent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRequestOwner() {
        return requestOwner;
    }

    public void setRequestOwner(String requestOwner) {
        this.requestOwner = requestOwner;
    }

    public String getResponseText() {
        return responseText;
    }

    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }

    public String getResponseType() {
        return responseType;
    }

    public void setResponseType(String responseType) {
        this.responseType = responseType;
    }

    public String getResponseRating() {
        return responseRating;
    }

    public void setResponseRating(String responseRating) {
        this.responseRating = responseRating;
    }

    public Map<String, String> getResponseParams() {
        return responseParams;
    }

    public void setResponseParams(Map<String, String> responseParams) {
        this.responseParams = responseParams;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getConversationIntent() {
        return conversationIntent;
    }

    public void setConversationIntent(String conversationIntent) {
        this.conversationIntent = conversationIntent;
    }

    @PrePersist
    protected void onCreate() {
        this.date = new Date();
    }
}
