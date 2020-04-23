package pwr.inf.ziwg.chatbot.repository;

import pwr.inf.ziwg.chatbot.domain.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
}
