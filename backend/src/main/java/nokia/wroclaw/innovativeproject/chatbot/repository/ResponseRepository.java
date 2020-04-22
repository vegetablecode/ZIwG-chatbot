package nokia.wroclaw.innovativeproject.chatbot.repository;

import nokia.wroclaw.innovativeproject.chatbot.domain.Response;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseRepository extends CrudRepository<Response, Long> {
}
