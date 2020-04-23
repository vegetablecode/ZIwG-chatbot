package pwr.inf.ziwg.chatbot.exceptions.request;

public class RequestIdExceptionResponse {

    private Long requestId;

    public RequestIdExceptionResponse(Long requestId) {
        this.requestId = requestId;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }
}
