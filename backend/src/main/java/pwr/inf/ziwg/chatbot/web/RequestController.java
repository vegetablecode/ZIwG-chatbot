package pwr.inf.ziwg.chatbot.web;

import com.ibm.watson.developer_cloud.assistant.v1.Assistant;
import com.ibm.watson.developer_cloud.assistant.v1.model.*;
import com.ibm.watson.developer_cloud.service.exception.NotFoundException;
import com.ibm.watson.developer_cloud.service.exception.RequestTooLargeException;
import com.ibm.watson.developer_cloud.service.exception.ServiceResponseException;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.smattme.MysqlExportService;
import pwr.inf.ziwg.chatbot.domain.*;
import pwr.inf.ziwg.chatbot.service.DocumentService;
import pwr.inf.ziwg.chatbot.service.MapValidationErrorService;
import pwr.inf.ziwg.chatbot.service.RequestService;
import pwr.inf.ziwg.chatbot.service.UserService;
import pwr.inf.ziwg.chatbot.util.LoggerUtil;
import pwr.inf.ziwg.chatbot.util.loggers.RequestLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.security.Principal;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/request")
@CrossOrigin
public class RequestController {

    @Value("${ibm.assistant.version.date}")
    private String assistantVersionDate;

    @Value("${ibm.assistant.workspace.id}")
    private String assistantWorkspace;

    @Value("${ibm.assistant.username}")
    private String assistantUser;

    @Value("${ibm.assistant.password}")
    private String assistantPass;

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    private Assistant service;

    private LoggerUtil logger = new LoggerUtil("requests.txt");
    private DateFormat dateFormat = new SimpleDateFormat("dd-mm-yyyy hh:mm:ss");

    private Map<String, Context> contextMap = new HashMap<>();

    @PostConstruct
    public void init() {
        service = new Assistant(assistantVersionDate);
        service.setUsernameAndPassword(assistantUser, assistantPass);
        service.setEndPoint("https://gateway-lon.watsonplatform.net/assistant/api");
    }

    @PostMapping("")
    public ResponseEntity<?> askChatbot(@Valid @RequestBody Request request, BindingResult result, Principal principal) throws IOException, SQLException, ClassNotFoundException, UnirestException {
        // check for errors
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) return errorMap;

        // backup & clear conversation case


        // get answer
        Context conversationContext;
        MessageResponse response;
        Document currentDocument = null;

        try {
            // get input data (question)
            String text = (request.getQuestion() == null) ? "" : request.getQuestion().getQuery();
            InputData input = new InputData.Builder(text).build();

            User currentUser = userService.getUser(principal.getName());

            // check for document (only if outside a node)
            if(contextMap.get(currentUser.getCurrentConversationId()) == null) {
                if(documentService.getDocumentType(text).isPresent()) {
                    // document found - redirect message
                    input = new InputData.Builder("Generic question").build();
                    currentDocument = documentService.getDocumentType(text).get();
                }
            }

            // get current user and set context
            conversationContext = (contextMap.get(currentUser.getCurrentConversationId()) == null) ? new Context() : contextMap.get(currentUser.getCurrentConversationId());

            //System.out.println("Checking for document: " + documentService.getDocumentType(text).getKeywords());

            // message builder
            MessageOptions options =
                    new MessageOptions
                            .Builder(assistantWorkspace)
                            .context(conversationContext)
                            .input(input)
                            .build();

            // get response & save new context
            response = service.message(options).execute();
            conversationContext = response.getContext();

            // add the response to the current request
            String data = response.getOutput().getText().toString();

            Response res = new Response();
            res.setMessage(data.substring(1, data.length() - 1)); // text
            request.setResponse(res);

            Conversation conversation = requestService.getCurrentConversation(conversationContext.getConversationId());
            if(currentDocument != null)
                conversation.setDocument(currentDocument);
            conversation.setWatsonId(conversationContext.getConversationId()); // conversation ID
            request.setConversation(conversation);
            userService.updateCurrentConversationId(principal.getName(), conversationContext.getConversationId());

            // save context to context map
            if (!response.getContext().getSystem().containsKey("branch_exited")) {
                contextMap.put(conversationContext.getConversationId(), conversationContext);
            } else {
                contextMap.put(conversationContext.getConversationId(), null);
            }

        } catch (NotFoundException e) {
            logger.log(new RequestLogger(dateFormat.format(new Date()), "ERROR", "NotFoundException", null, null));
            throw e;
        } catch (RequestTooLargeException e) {
            logger.log(new RequestLogger(dateFormat.format(new Date()), "ERROR", "RequestTooLargeException", null, null));
            throw e;
        } catch (ServiceResponseException e) {
            logger.log(new RequestLogger(dateFormat.format(new Date()), "ERROR", "ServiceResponseException", null, null));
            throw e;
        }

        // create map and save all entities from context
        Map<String, String> map = new HashMap<>();
        for (Map.Entry<String, Object> entry : response.getContext().entrySet()) {
            if ((!entry.getKey().equals("system")) && (!entry.getKey().equals("conversation_id"))) {
                map.put(entry.getKey(), entry.getValue().toString());
            }
        }
        Response res = request.getResponse();
        res.setParams(map);
        request.setResponse(res);

        // set question intent and confidence (one for request)
        Question question = request.getQuestion();
        if (!response.getIntents().isEmpty()) {
            question.setIntent(response.getIntents().get(0).getIntent());
            question.setConfidence(response.getIntents().get(0).getConfidence());
        } else question.setIntent("");
        request.setQuestion(question);

        // set conversation intent (one for context)
        String conversationIntent = requestService.getMessageIntent(principal.getName(), conversationContext.getConversationId());
        Conversation currentConversation = request.getConversation();
        if (!conversationIntent.equals("")) // if this conversation had an intent
            currentConversation.setIntent(conversationIntent); // set this intent on request
        else { // if not
            if (!response.getIntents().isEmpty()) // if there is intent in current response
                currentConversation.setIntent(response.getIntents().get(0).getIntent());
            else currentConversation.setIntent(conversationIntent);
        }
        request.setConversation(currentConversation);

        // get response type (if node exited)
        if (response.getContext().getSystem().containsKey("branch_exited")) {
            Response r = request.getResponse();
            r.setType(request.getConversation().getIntent());
            request.setResponse(r);
            if (request.getConversation().getIntent().equals("Send_opinion")) {
                userService.sendMessage(principal.getName(), response.getInput().getText());
            }
        } else {
            Response r = request.getResponse();
            r.setType("");
            request.setResponse(r);
        }

        // no rating yet
        Response r = request.getResponse();
        r.setRating("0");
        request.setResponse(r);

        // if it's inside document node - catch
        if(request.getConversation().getIntent().equals("Generic_question")) {
            Response documentResponse = request.getResponse();
            String prevMessage = documentResponse.getMessage();
            String convertedMessage = documentService.mapResponse(prevMessage, request.getConversation().getDocument());
            documentResponse.setMessage(convertedMessage);

            if(convertedMessage.isEmpty()) {
                // all parameters collected - get the document
                Response prevRes = request.getResponse();
                prevRes.setMessage(documentService.getDocument(request));
                request.setResponse(prevRes);

                // new context
                contextMap.put(conversationContext.getConversationId(), null);
            }
        }

        // save request
        Request request1 = requestService.saveOrUpdateRequest(request, principal.getName());

        // log response
        logger.log(new RequestLogger(dateFormat.format(new Date()), "INFO", "Ask Chatbot", request, response));

        return new ResponseEntity<Request>(request1, HttpStatus.CREATED);

        //return new ResponseEntity<MessageResponse>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public Iterable<Request> getAllRequests() {
        return requestService.findAllRequests();
    }

    @GetMapping("/userRequests")
    public Iterable<Request> getUserRequests(Principal principal) {
        User currentUser = userService.getUser(principal.getName());
        return requestService.findAllUserRequests(currentUser.getUsername());
    }

    @PostMapping("/userRequestsPagination")
    public Iterable<Request> getNextUserRequestsPage(@RequestBody Map<String, String> pages, Principal principal) {
        User currentUser = userService.getUser(principal.getName());
        return requestService.findNextUserRequestsPage(currentUser.getUsername(), pages, currentUser.getLastMessageId());
    }

    @PostMapping("/rateAnswer")
    public ResponseEntity<?> rateAnswer(@RequestBody Map<String, String> rating, BindingResult result) {
        // check for errors
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) return errorMap;

        Request request = requestService.setAnswerRating(rating);

        // log response
        logger.log(new RequestLogger(dateFormat.format(new Date()), "INFO", "Ask Chatbot", request, null));

        return new ResponseEntity<Request>(request, HttpStatus.OK);
    }

    @PostMapping("/getRatedRequests")
    public Iterable<Request> getNegativeRatedRequests(@RequestBody Map<String, String> rating, Principal principal) {
        User currentUser = userService.getUser(principal.getName());
        return requestService.findRatedRequests(currentUser, rating);
    }

    @RequestMapping(value = "/getBackupFile", method = RequestMethod.GET)
    public void getBackupFile(HttpServletResponse response) {
        try {
            // get file as InputStream
            InputStream is = new FileInputStream("./logs/requests.txt");

            // at JSON array characters
            String beginning = "[";
            String end = "]";
            List<InputStream> streams = Arrays.asList(
                    new ByteArrayInputStream(beginning.getBytes()),
                    is,
                    new ByteArrayInputStream(end.getBytes()));
            InputStream modified = new SequenceInputStream(Collections.enumeration(streams));

            // copy it to response's OutputStream
            org.apache.commons.io.IOUtils.copy(modified, response.getOutputStream());
            response.setContentType("application/json");
            response.flushBuffer();
        } catch (IOException ex) {
            logger.log(new RequestLogger(dateFormat.format(new Date()), "INFO", "Error writing file to output stream.", null, null));
            throw new RuntimeException("IOError writing file to output stream");
        }

    }

    @GetMapping("/getSQLBackup")
    public ResponseEntity<Map> getSQLBackup() throws SQLException, IOException, ClassNotFoundException {
        //required properties for exporting of db
        Properties properties = new Properties();
        properties.setProperty(MysqlExportService.JDBC_CONNECTION_STRING, "jdbc:mysql://us-cdbr-iron-east-03.cleardb.net/heroku_555f66199199af3?reconnect=true");
        properties.setProperty(MysqlExportService.DB_NAME, "heroku_555f66199199af3");
        properties.setProperty(MysqlExportService.DB_USERNAME, "b56c555d260053");
        properties.setProperty(MysqlExportService.DB_PASSWORD, "ab87394d");

        //properties relating to email config
        properties.setProperty(MysqlExportService.EMAIL_HOST, "smtp.gmail.com");
        properties.setProperty(MysqlExportService.EMAIL_PORT, "587");
        properties.setProperty(MysqlExportService.EMAIL_USERNAME, "chatbotwatson1@gmail.com");
        properties.setProperty(MysqlExportService.EMAIL_PASSWORD, "NokiaChatbot1");
        properties.setProperty(MysqlExportService.EMAIL_FROM, "chatbotwatson1@gmail.com");
        properties.setProperty(MysqlExportService.EMAIL_TO, "thisecretninja@gmail.com");

        //set the outputs temp dir
        properties.setProperty(MysqlExportService.TEMP_DIR, new File("external").getPath());

        MysqlExportService mysqlExportService = new MysqlExportService(properties);
        mysqlExportService.export();

        Map<String, String> res = new HashMap<>();

        // remove old requests
        long DAY_IN_MS = 1000 * 60 * 60 * 24;
        Date date = new Date(System.currentTimeMillis() - (7 * DAY_IN_MS));
        Date weekAgo = new Date(date.getTime() - (7 * DAY_IN_MS));
        System.out.println("Week ago -> " + weekAgo.toString());
        requestService.removeOldRequests(weekAgo);

        res.put("status", "ok");
        return new ResponseEntity<Map>(res, HttpStatus.OK);
    }

}
