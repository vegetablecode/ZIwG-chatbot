package nokia.wroclaw.innovativeproject.chatbot.repository;

import nokia.wroclaw.innovativeproject.chatbot.domain.Conversation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends CrudRepository<Conversation, Long> {
}
