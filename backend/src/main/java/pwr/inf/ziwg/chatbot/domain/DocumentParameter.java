package pwr.inf.ziwg.chatbot.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class DocumentParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    private String label;
    private String type;
    private String regex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Document document;

    public DocumentParameter() {

    }

    public DocumentParameter(Long id, String label, String type, String regex, Document document) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.regex = regex;
        this.document = document;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRegex() {
        return regex;
    }

    public void setRegex(String regex) {
        this.regex = regex;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
}
