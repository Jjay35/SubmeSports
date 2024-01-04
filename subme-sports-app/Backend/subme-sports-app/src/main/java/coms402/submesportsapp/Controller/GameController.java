package coms402.submesportsapp.Controller;

import coms402.submesportsapp.Model.ChatHistory;
import coms402.submesportsapp.Model.Game;
import coms402.submesportsapp.Model.PlayerDetails;
import coms402.submesportsapp.Repository.ChatHistoryRepository;
import coms402.submesportsapp.Repository.GameRepository;

import coms402.submesportsapp.Repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;



@RestController
public class GameController
{
    @Autowired
    GameRepository gameRep;
    @Autowired
    ProfileRepository profileRep;

    @Autowired
    ChatHistoryRepository chRepo;



    /**
     * Gets public games and private games that the current user has access to
     * Name of gameCreator updated at the time of fetching
     * @param userID
     * @return
     */
    @GetMapping(path = "/games/{userID}")
    List<Game> getGames(@PathVariable String userID)
    {
        List<Game>allGames = gameRep.findAll();
        List<Game>relevantGames = new ArrayList<Game>();

        for(Game tempGame :allGames){
            if(!tempGame.getIsPrivate() &&
                    !tempGame.getIsExpired() &&
                    !tempGame.getPlayersJoined().contains(userID) &&
                    !tempGame.getWaitList().contains(userID)){
                String creatorName = profileRep.findById(tempGame.getGameCreator()).getName();
                tempGame.setGameCreatorName(creatorName);
                gameRep.save(tempGame);
                relevantGames.add(tempGame);
            }

            if(tempGame.getIsPrivate() &&
                    !tempGame.getIsExpired() &&
                    !tempGame.getPlayersJoined().contains(userID) &&
                    tempGame.getPrivateMembersList().contains(userID) &&
                    !tempGame.getWaitList().contains(userID)){
                String creatorName = profileRep.findById(tempGame.getGameCreator()).getName();
                tempGame.setGameCreatorName(creatorName);
                gameRep.save(tempGame);
                relevantGames.add(tempGame);
            }
        }

        return relevantGames;
    }


    /**
     *  Get user's active games
     *  Name of game creator will be updated when fetching from DB
     */
    @GetMapping(path ="/game/active/{userID}")
    List<Game> getActiveGames(@PathVariable String userID){
        List<Game> allGames = gameRep.findAll();
        List<Game>activeGames = new ArrayList<Game>();

        for(Game tempGame : allGames){
            if( !tempGame.getIsExpired() && (tempGame.getPlayersJoined().contains(userID) || tempGame.getWaitList().contains(userID)) ){
                String creatorName = profileRep.findById(tempGame.getGameCreator()).getName();
                tempGame.setGameCreatorName(creatorName);
                gameRep.save(tempGame);
                activeGames.add(tempGame);
            }
        }

        return activeGames;
    }

    /**
     * Get user's past games
     */
    @GetMapping(path ="/game/past/{userID}")
    List<Game> getPastGames(@PathVariable String userID){
        List<Game> allGames = gameRep.findAll();
        List<Game> pastGames = new ArrayList<Game>();

        for(Game tempGame : allGames){
            if( tempGame.getIsExpired() && tempGame.getPlayersJoined().contains(userID) ){
                String creatorName = profileRep.findById(tempGame.getGameCreator()).getName();
                tempGame.setGameCreatorName(creatorName);
                gameRep.save(tempGame);
                pastGames.add(tempGame);
            }
        }

        return pastGames;
    }


    @GetMapping(path = "/game/{id}")
    Game getGameById(@PathVariable int id)
    {
        Game tempGame = gameRep.findById(id);
        String creatorName = profileRep.findById(tempGame.getGameCreator()).getName();
        tempGame.setGameCreatorName(creatorName);

        return gameRep.save(tempGame);
    }

    /**
     * Returns true if the user joined the game, false otherwise
     * @param id
     * @param userID
     * @return
     */
    @GetMapping(path = "/game/isJoined/{id}/{userID}")
    Boolean getIsPlayerJoined(@PathVariable int id, @PathVariable String userID)
    {
        if(gameRep.findById(id) == null)
        {
            return null;
        }

        List<String>playersJoined = gameRep.findById(id).getPlayersJoined();
        return playersJoined.contains(userID);
    }

    /**
     * Returns true if user is in waitlist of a game, false otherwise
     * @param id
     * @param userID
     * @return
     */
    @GetMapping(path = "/game/isInWaitlist/{id}/{userID}")
    Boolean getIsInWaitlist(@PathVariable int id , @PathVariable String userID){
        if(gameRep.findById(id) == null)
        {
            return null;
        }

        List<String>waitListMembers = gameRep.findById(id).getWaitList();
        return waitListMembers.contains(userID);
    }

    /**
     * Shows details of players who have joined a game
     */
    @GetMapping(path= "/game/playersJoined/{id}")
    List<PlayerDetails> getPlayerJoined(@PathVariable int id){

        if(gameRep.findById(id) == null){
            return null;
        }

        // Contains an array of player's userID that have joined a game
        List<String> playersJoined = gameRep.findById(id).getPlayersJoined();

        // iterate through each of the user ID's for players that joined the game and perform
        // a findByID operation with profile to get their names
        List<PlayerDetails> playersJoinedDetails = new ArrayList<PlayerDetails>() ;

        if(playersJoined.isEmpty()){
            return null;
        }

        for(String playerJoined : playersJoined){
            String playerName = profileRep.findById(playerJoined).getName();
            playersJoinedDetails.add(new PlayerDetails(playerJoined, playerName));
        }

        return playersJoinedDetails;
    };

    /**
     * Shows details of users that have joined the waitlist of a game
     */
    @GetMapping(path= "/game/playersInWaitlist/{id}")
    List<PlayerDetails> getWaitlistPlayers(@PathVariable int id){
        if(gameRep.findById(id) == null){
            return null;
        }

        // Contains an array of player's userID that are in a waitlist of a game
        List<String> waitListMembers = gameRep.findById(id).getWaitList();

        // iterate through each of the user ID's for users have joined the waitlist and perform
        // a findByID operation with profile to get their names
        List<PlayerDetails> waitListMembersDetails = new ArrayList<PlayerDetails>() ;

        for(String waitListMember : waitListMembers){
            String playerName = profileRep.findById(waitListMember).getName();
            waitListMembersDetails.add(new PlayerDetails(waitListMember, playerName));
        }

        return waitListMembersDetails;
    }


    /**
     Creates a game by sending a game object to the database
     If game is Private, automatically adds game creator to private members list
     Also creates a new ChatHistory session and saves new chat ID to game
     **/
    @PostMapping(path = "/game")
    Game createGame(@RequestBody Game game)
    {
        Game tempGame = game;

        if(tempGame.getIsPrivate()){
            String gameCreatorId = tempGame.getGameCreator();
            List<String> privateMembersList = new ArrayList<String>();
            privateMembersList = tempGame.getPrivateMembersList();
            privateMembersList.add(gameCreatorId);
            tempGame.setPrivateMembersList(privateMembersList);
        }

        ChatHistory tempChatHistory = new ChatHistory();
        int generatedChatIDFromDB = chRepo.save(tempChatHistory).getId();
        tempGame.setChatID(generatedChatIDFromDB);

        return gameRep.save(tempGame);
    }

    /**
     Updates a current games state with a game object as well as a selected game ID
     **/
    @PutMapping(path = "/game/{id}")
    Game updateGame(@PathVariable int id, @RequestBody Game update)
    {
        if(gameRep.findById(id) == null)
        {
            return null;
        }
        gameRep.save(update);
        return gameRep.findById(id);
    }

    /**
     Deletes a game from the database using a specific ID
     **/
    @DeleteMapping(path = "/game/{id}")
    List<Game> deleteGame(@PathVariable int id)
    {
        gameRep.deleteById(id);
        return gameRep.findAll();
    }


}
