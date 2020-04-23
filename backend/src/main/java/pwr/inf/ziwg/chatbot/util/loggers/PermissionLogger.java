package pwr.inf.ziwg.chatbot.util.loggers;

public class PermissionLogger {

    private String date;
    private String status;
    private String action;
    private String whoSet;
    private String whoGet;

    public PermissionLogger() {
    }

    public PermissionLogger(String date, String status, String action, String whoSet, String whoGet) {
        this.date = date;
        this.status = status;
        this.action = action;
        this.whoSet = whoSet;
        this.whoGet = whoGet;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getWhoSet() {
        return whoSet;
    }

    public void setWhoSet(String whoSet) {
        this.whoSet = whoSet;
    }

    public String getWhoGet() {
        return whoGet;
    }

    public void setWhoGet(String whoGet) {
        this.whoGet = whoGet;
    }
}
