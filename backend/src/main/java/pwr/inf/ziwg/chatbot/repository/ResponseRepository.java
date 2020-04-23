package pwr.inf.ziwg.chatbot.repository;

import pwr.inf.ziwg.chatbot.domain.Response;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseRepository extends CrudRepository<Response, Long> {
}
