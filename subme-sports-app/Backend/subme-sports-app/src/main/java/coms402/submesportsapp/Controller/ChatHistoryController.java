package coms402.submesportsapp.Controller;

import coms402.submesportsapp.Model.ChatHistory;
import coms402.submesportsapp.Repository.ChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin({"*"})
public class ChatHistoryController {

    @Autowired
    private ChatHistoryRepository chRepo;

    @GetMapping({"/chatHistory/{id}"})
    ChatHistory getChatHistory(@PathVariable int id) {
        return chRepo.findById(id);
    }

}
