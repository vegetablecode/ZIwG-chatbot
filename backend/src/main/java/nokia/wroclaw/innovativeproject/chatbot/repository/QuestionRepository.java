package nokia.wroclaw.innovativeproject.chatbot.repository;

import nokia.wroclaw.innovativeproject.chatbot.domain.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
}
