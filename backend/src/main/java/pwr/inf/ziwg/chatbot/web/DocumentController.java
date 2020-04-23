package pwr.inf.ziwg.chatbot.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pwr.inf.ziwg.chatbot.domain.Document;
import pwr.inf.ziwg.chatbot.service.DocumentService;
import pwr.inf.ziwg.chatbot.service.MapValidationErrorService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/document")
@CrossOrigin
public class DocumentController {

    @Autowired
    private DocumentService service;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("/addDocument")
    public ResponseEntity<?> addNewDocument(@RequestBody Document document, BindingResult result) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) return errorMap;
        Document response = service.addNewDocument(document);
        return new ResponseEntity<Document>(response, HttpStatus.CREATED);
    }

}
