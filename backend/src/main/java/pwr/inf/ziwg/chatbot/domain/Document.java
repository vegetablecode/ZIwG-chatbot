package pwr.inf.ziwg.chatbot.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keywords;

    @OneToMany(targetEntity = DocumentParameter.class, mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DocumentParameter> params = new ArrayList<>();

    @OneToMany(targetEntity = Header.class, mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Header> headers = new ArrayList<>();

    private String type;

    // API
    private String endpoint;
    private String method;

    @Lob
    @Column(length = 65535,columnDefinition="Text")
    private String body;

    @Lob
    @Column(length = 65535,columnDefinition="Text")
    private String template;

    public Document() {
    }

    public Document(Long id, String keywords, List<DocumentParameter> params, List<Header> headers, String type, String endpoint, String method, String body, String template) {
        this.id = id;
        this.keywords = keywords;
        this.params = params;
        this.headers = headers;
        this.type = type;
        this.endpoint = endpoint;
        this.method = method;
        this.body = body;
        this.template = template;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public List<DocumentParameter> getParams() {
        return params;
    }

    public void setParams(List<DocumentParameter> params) {
        this.params = params;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public List<Header> getHeaders() {
        return headers;
    }

    public void setHeaders(List<Header> headers) {
        this.headers = headers;
    }
}
