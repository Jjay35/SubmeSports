package coms402.submesportsapp.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "FriendRelation")
public class FriendRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String friendUserID;

    private String friendName;

    private char status;

    private int chatID = -1;

    public FriendRelation() {

    }

    /**
     * Default constructor, used as template to add targetUser as friend
     * @param friendUserID
     */
    public FriendRelation(String friendUserID, char status, int chatID ) {
        this.friendUserID = friendUserID;
        this.status = status;
        this.chatID = chatID;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFriendUserID() {return friendUserID;}
    public void setFriendUserID(String friendUserID){this.friendUserID = friendUserID;}

    public String getFriendName() {return friendName;}
    public void setFriendName(String friendUserName) {this.friendName = friendName;}

    public char getStatus() {return status;}

    public void setStatus(char status) {this.status = status;}

    public int getChatID() {return chatID;}

    public void setChatID(int chatID) {this.chatID = chatID;}

}
