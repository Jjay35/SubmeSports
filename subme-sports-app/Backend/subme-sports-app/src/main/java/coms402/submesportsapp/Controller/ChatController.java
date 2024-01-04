package coms402.submesportsapp.Controller;

import coms402.submesportsapp.Model.ChatHistory;
import coms402.submesportsapp.Model.Message;
import coms402.submesportsapp.Model.Status;
import coms402.submesportsapp.Repository.ChatHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Websocket controller class, handles live chatting between users
 */
@Controller
public class ChatController {
    /**
     * Allows for dynamic switching between users during private chats
     */
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    ChatHistoryRepository chatRep;


    /**
     * Receives messages and direct message to the correct group chat
     * saves chat history as well
     * @param message
     * @param header chatID received from frontEnd
     * @return
     */
    @MessageMapping("/group-message")
    @Transactional
    public Message receiveMessage(@Payload Message message, @Header(name="token") String header){
        if(message.getStatus().equals(Status.MESSAGE)){
            String destination = "/groupChat/" + header.replaceAll("\\s", "");
            simpMessagingTemplate.convertAndSend(destination, message);
            ChatHistory tempChatHistory = chatRep.findById(Integer.parseInt(header));
            tempChatHistory.appendMessage(message);
            chatRep.save(tempChatHistory);
        }

        return message;
    }

    /**
     * Receives and directs private message to the correct user,
     * saves chat history as well
     * @param message
     * @param header chatID received from frontEnd
     * @return
     */
    @MessageMapping("/private-message")
    @Transactional
    public Message recMessage(@Payload Message message, @Header(name="token") String header){
        if(message.getStatus().equals(Status.MESSAGE)){
            simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
            ChatHistory tempChatHistory = chatRep.findById(Integer.parseInt(header));
            tempChatHistory.appendMessage(message);
            chatRep.save(tempChatHistory);
        }
        return message;
    }
}
