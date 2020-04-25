package pwr.inf.ziwg.chatbot.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keywords;

    //@OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, mappedBy = "document", orphanRemoval = true)
    //private List<DocumentParameter> params = new ArrayList<>();

    @OneToMany(targetEntity = DocumentParameter.class, mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DocumentParameter> params = new ArrayList<>();

    //@OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER, mappedBy = "document", orphanRemoval = true)
    //private List<Conversation> conversations = new ArrayList<>();


    public Document() {
    }

    public Document(Long id, String keywords, List<DocumentParameter> params) {
        this.id = id;
        this.keywords = keywords;
        this.params = params;
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


}
