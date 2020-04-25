package pwr.inf.ziwg.chatbot.repository;

import pwr.inf.ziwg.chatbot.domain.Conversation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends CrudRepository<Conversation, Long> {
    Conversation findByWatsonId(String conversationId);
}
