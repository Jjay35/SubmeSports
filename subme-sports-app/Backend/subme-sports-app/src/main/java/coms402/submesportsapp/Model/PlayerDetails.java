package coms402.submesportsapp.Model;

/**
 * Used to encapsulate playerDetails for
 * game retrieval
 */
public class PlayerDetails {
    private String playerUserID;
    private String playerName;

    public PlayerDetails(String playerUserID, String playerName){
        this.playerUserID = playerUserID;
        this.playerName = playerName;
    }

    public String getPlayerUserID() {
        return playerUserID;
    }

    public void setPlayerUserID(String playerUserID) {
        this.playerUserID = playerUserID;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
