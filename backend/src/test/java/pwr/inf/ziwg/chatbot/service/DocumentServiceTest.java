package pwr.inf.ziwg.chatbot.service;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;
import pwr.inf.ziwg.chatbot.domain.Document;
import pwr.inf.ziwg.chatbot.repository.DocumentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class DocumentServiceTest {

    List<Document> documentListMock;

    @Mock
    DocumentRepository repository;

    DocumentService service = new DocumentService();

    @Before
    public void setUp() {
//        documentListMock = new ArrayList<>();
//        documentListMock.add(new Document(0L, "free conference rooms room", null));
//        documentListMock.add(new Document(1L, "calendar today", null));
//        documentListMock.add(new Document(2L, "free rooms studio", null));
//        documentListMock.add(new Document(3L, "price petrol", null));
//        documentListMock.add(new Document(3L, "price petrol", null));

        Mockito.when(repository.findAll()).thenReturn(documentListMock);

        ReflectionTestUtils.setField(service, "repository", repository);
    }

    @Ignore
    @Test
    public void getDocumentTypeShouldReturnSpecificDocument() {
        Optional<Document> res =  service.getDocumentType("free conference rooms");
        assertEquals(documentListMock.get(0).getKeywords(), res.get().getKeywords());
    }

    @Ignore
    @Test
    public void getDocumentTypeShouldReturnNothing() {
        Optional<Document> res =  service.getDocumentType("free confrerence roo");
        assertEquals(false, res.isPresent());
    }

    @Ignore
    @Test
    public void getDocumentTypeShouldReturnPetrolPrice() {
        Optional<Document> res =  service.getDocumentType("petrol price");
        assertEquals(documentListMock.get(3).getKeywords(), res.get().getKeywords());
    }
}