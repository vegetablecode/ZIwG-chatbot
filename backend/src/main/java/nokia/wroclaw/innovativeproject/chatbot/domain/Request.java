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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "response_id", referencedColumnName = "id")
    private Response response;

    // conversation
    private String conversationId;
    private String conversationIntent;

    public Request() {

    }

    public Request(Long id, Question question, Date date, User user, String requestOwner, Response response, String conversationId, String conversationIntent) {
        this.id = id;
        this.question = question;
        this.date = date;
        this.user = user;
        this.requestOwner = requestOwner;
        this.response = response;
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

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    @PrePersist
    protected void onCreate() {
        this.date = new Date();
    }
}
