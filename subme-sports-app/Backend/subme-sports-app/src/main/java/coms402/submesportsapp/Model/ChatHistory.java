package coms402.submesportsapp.Model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ChatHistory")
public class ChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToMany(cascade = {CascadeType.ALL})
    private List<Message> messages = new ArrayList<Message>();

    public ChatHistory() { }

    public void setId(int id) {
        this.id = id;
    }
    public int getId() {
        return id;
    }

    public List<Message> getMessages() {
        return this.messages;
    }

    public void setMessages(List<Message> messages){
        this.messages = messages;
    }

    public void appendMessage(Message message){
        this.messages.add(message);
    }
}
