package pwr.inf.ziwg.chatbot.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pwr.inf.ziwg.chatbot.domain.Document;

@Repository
public interface DocumentRepository extends CrudRepository<Document, Long> {
}
