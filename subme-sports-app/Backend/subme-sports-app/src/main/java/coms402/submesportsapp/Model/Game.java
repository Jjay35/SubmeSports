package coms402.submesportsapp.Model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Game")
public class Game
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String gameCreator;

    private String gameCreatorName;

    private String sport;
    private List<String> location; // [locationName, latitude, longitude]
    private char gameType;
    private String duration;
    private String startTime;
    private boolean isExpired;

    private char teamGender;
    private int playersNeeded;
    private int gamePlayerNo;

    private char competitiveness;

    private String gameDetails;
    private boolean isPrivate;

    private List<String> privateMembersList;
    private List<String> playersJoined;
    private List<String> waitList;

    private int chatID = -1;


    public Game() { }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGameCreator() {
        return gameCreator;
    }

    public void setGameCreator(String gameCreator) { this.gameCreator = gameCreator;}

    public String getGameCreatorName() {
        return gameCreatorName;
    }

    public void setGameCreatorName(String gameCreatorName) { this.gameCreatorName = gameCreatorName;}
    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }
    public List<String> getLocation() {
        return location;
    }

    public void setLocation(List<String> location) {
        this.location = location;
    }
    public char getGameType() {
        return gameType;
    }

    public void setGameType(char gameType ) {
        this.gameType = gameType;
    }
    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public boolean getIsExpired(){
        return isExpired;
    }

    public void setIsExpired(boolean isExpired){
        this.isExpired = isExpired;
    }

    public char getTeamGender() {return teamGender;}

    public void setTeamGender(char teamGender) {
        this.teamGender = teamGender;
    }
    public int getPlayersNeeded() {
        return playersNeeded;
    }

    public void setPlayersNeeded(int playersNeeded) {
        this.playersNeeded = playersNeeded;
    }
    public int getGamePlayerNo() {
        return gamePlayerNo;
    }

    public void setGamePlayerNo(int gamePlayerNo) {
        this.gamePlayerNo= gamePlayerNo;
    }

    public char getCompetitiveness() {
        return competitiveness;
    }

    public void setCompetitiveness(char competitiveness) {
        this.competitiveness = competitiveness;
    }
    public String getGameDetails() {
        return gameDetails;
    }

    public void setGameDetails(String gameDetails) {
        this.gameDetails = gameDetails;
    }
    public  boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public List<String>getPrivateMembersList(){return privateMembersList;}

    public void setPrivateMembersList(List<String> privateMembersList) {
        this.privateMembersList = privateMembersList;
    }

    public List<String> getPlayersJoined() {
        return playersJoined;
    }

    public void setPlayersJoined(List<String> playersJoined) {
        this.playersJoined = playersJoined;
    }

    public List<String> getWaitList() {
        return waitList;
    }

    public void setWaitList(List<String> waitList) {
        this.waitList= waitList;
    }

    public int getChatID(){return chatID;}

    public void setChatID(int chatID){this.chatID = chatID;}


}
