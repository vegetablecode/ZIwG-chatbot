package pwr.inf.ziwg.chatbot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pwr.inf.ziwg.chatbot.domain.Header;

@Repository
public interface HeaderRepository extends JpaRepository<Header, Long> {
}
