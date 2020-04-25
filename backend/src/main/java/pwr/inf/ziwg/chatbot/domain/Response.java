package pwr.inf.ziwg.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Entity
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String type; // "" means text
    private String rating;

    @OneToOne(mappedBy = "response")
    @JsonIgnore
    private Request request;

    @ElementCollection
    @CollectionTable(name = "PARAMETERS")
    @MapKeyColumn(name = "type")
    @Column(name = "name")
    private Map<String, String> params = new HashMap<>();

    public Response() {

    }

    public Response(Long id, String message, String type, String rating, Request request, Map<String, String> params) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.rating = rating;
        this.request = request;
        this.params = params;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Map<String, String> getParams() {
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
