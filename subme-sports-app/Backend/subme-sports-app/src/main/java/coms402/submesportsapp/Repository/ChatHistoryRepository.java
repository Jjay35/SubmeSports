package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.ChatHistory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryRepository  extends JpaRepository<ChatHistory, Long> {

    @Transactional
    ChatHistory findById(int id);


}
