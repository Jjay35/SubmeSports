package coms402.submesportsapp.Model;

/**
 * FriendDetails class used to facilitate
 * name retrieval of users in friendRelation list of
 * current User
 */

public class FriendDetails {
    private String name;

    private String userID;

    private char status;

    private int chatID;

    public FriendDetails(String name, String userID, char status, int chatID){
        this.name = name;
        this.userID = userID;
        this.status = status;
        this.chatID = chatID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public char getStatus() {
        return status;
    }

    public void setStatus(char status) {
        this.status = status;
    }

    public int getChatID() {
        return chatID;
    }

    public void setChatID(int chatID) {
        this.chatID = chatID;
    }
}
