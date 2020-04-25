package pwr.inf.ziwg.chatbot.service;

import pwr.inf.ziwg.chatbot.domain.Conversation;
import pwr.inf.ziwg.chatbot.domain.Request;
import pwr.inf.ziwg.chatbot.domain.Response;
import pwr.inf.ziwg.chatbot.domain.User;
import pwr.inf.ziwg.chatbot.exceptions.request.RequestIdException;
import pwr.inf.ziwg.chatbot.repository.ConversationRepository;
import pwr.inf.ziwg.chatbot.repository.RequestRepository;
import pwr.inf.ziwg.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public Request saveOrUpdateRequest(Request request, String username) {
        try {
            User user = userRepository.findByUsername(username); // only if the token is valid
            request.setUser(user);
            request.setRequestOwner(user.getUsername());
            return requestRepository.save(request);
        } catch (Exception ex) {
            throw new RequestIdException("Request ID '" + request.getId() + "' already exists.");
        }
    }

    public Iterable<Request> findAllRequests() {
        return requestRepository.findAll();
    }

    public Iterable<Request> findAllUserRequests(String username) {
        Iterable<Request> allRequests = requestRepository.findAll();
        List<Request> userRequests = new ArrayList<>();
        for (Request request : allRequests) {
            if (request.getUser().getUsername().equals(username))
                userRequests.add(request);
        }
        return userRequests;
    }

    public String getMessageIntent(String username, String conversationId) {
        Iterable<Request> userRequests = findAllUserRequests(username);
        for (Request userRequest : userRequests) {
            if ((userRequest.getConversation().getWatsonId().equals(conversationId)) && (!userRequest.getConversation().getIntent().equals("")))
                return userRequest.getConversation().getIntent();
        }
        return "";
    }

    public Request setAnswerRating(Map<String, String> rating) {
        Iterable<Request> userRequests = findAllUserRequests(rating.get("username"));
        Request ratedRequest = new Request();
        for (Request userRequest : userRequests) {
            if (userRequest.getId().equals(Long.parseLong(rating.get("id")))) {
                ratedRequest = userRequest;
                Response response = userRequest.getResponse();
                response.setRating(rating.get("rating"));
                ratedRequest.setResponse(response);
                requestRepository.save(ratedRequest);
            }
        }

        return ratedRequest;
    }


    public Iterable<Request> findNextUserRequestsPage(String username, Map<String, String> pages, Long lastMessageId) {
        int pageSize = 3;
        int pageNumber = Integer.parseInt(pages.get("page"));

        if(lastMessageId == null)
            lastMessageId = Long.valueOf(-1);

        List<Request> requests = new ArrayList<>();
        for(int i=pageNumber; i>=0; i--) {
            Pageable page = PageRequest.of(i, pageSize, Sort.by("id").descending());
            List<Request> requestPage = requestRepository.findAllByRequestOwnerAndIdGreaterThan(username, page, lastMessageId);
            Collections.reverse(requestPage);
            requests.addAll(requestPage);
        }

        return requests;
    }

    public Iterable<Request> findRatedRequests(User user, Map<String, String> rating) {
        String ratingNumber = rating.get("rating");

        if(user.getIsAdmin() && (ratingNumber != null)) {
            return requestRepository.findAllByResponseRating(ratingNumber);
        }
        return new ArrayList<Request>();
    }

    public void removeOldRequests(Date weekAgo) {
        requestRepository.deleteByDateBefore(weekAgo);
    }

    public long getDaysAgo() {
        Date now = new Date();
        Date lastRequestDate = new Date();
        long days;
        List<Request> requests = requestRepository.findFirst1ByOrderByDateAsc();
        if(requests != null) {
            Request request = requests.get(0);
            lastRequestDate = request.getDate();
        }
        long diff = now.getTime() - lastRequestDate.getTime();
        days = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
        return days;
    }

    public Conversation getCurrentConversation(String conversationId) {
        Conversation conversation = null;
        if(!conversationId.isEmpty()) {
            conversation = conversationRepository.findByWatsonId(conversationId);
        }
        return conversation == null ? new Conversation() : conversation;
    }
}
