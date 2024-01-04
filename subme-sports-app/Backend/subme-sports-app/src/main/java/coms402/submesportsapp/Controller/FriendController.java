package coms402.submesportsapp.Controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import coms402.submesportsapp.Model.*;
import coms402.submesportsapp.Repository.ChatHistoryRepository;
import coms402.submesportsapp.Repository.FriendRepository;
import coms402.submesportsapp.Repository.ProfileRepository;
import coms402.submesportsapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
public class FriendController {
    @Autowired
    private FriendRepository frRepo;
    @Autowired
    private UserRepository uRepo;

    @Autowired
    private ProfileRepository pRepo;

    @Autowired
    private ChatHistoryRepository chRepo;


    /**
     * Gets all friends of current user
     */
    @JsonProperty
    @GetMapping("/friends/{currUserID}")
    public List<FriendDetails> getAllFriends(@PathVariable String currUserID){

        Friend friends = frRepo.findById(currUserID);
        List<FriendDetails> friendDetails = new ArrayList<FriendDetails>();

        if(!friends.getFriends().isEmpty()){
            for(FriendRelation friendRelation : friends.getFriends()){
                if(friendRelation.getStatus() == 'F'){
                    String name = pRepo.findById(friendRelation.getFriendUserID()).getName();
                    String friendUserID = friendRelation.getFriendUserID();
                    char status = friendRelation.getStatus();
                    int chatID = friendRelation.getChatID();
                    friendDetails.add(new FriendDetails(name, friendUserID, status, chatID));
                }
            }
        }

        return friendDetails;
    }

    /**
     * Gets all friend requests of current user
     */
    @GetMapping("/friends/requests/{currUserID}")
    public List<FriendDetails> getFriendRequests(@PathVariable String currUserID){

        Friend friends = frRepo.findById(currUserID);

        List<FriendDetails> friendDetails = new ArrayList<FriendDetails>();

        if(!friends.getFriends().isEmpty())
        {
            for(FriendRelation friendRelation : friends.getFriends()){
                if(friendRelation.getStatus() == 'P'){
                    String name = pRepo.findById(friendRelation.getFriendUserID()).getName();
                    String friendUserID = friendRelation.getFriendUserID();
                    char status = friendRelation.getStatus();
                    int chatID = friendRelation.getChatID();
                    friendDetails.add(new FriendDetails(name, friendUserID, status, chatID));
                }
            }
        }

        return friendDetails;
    }

    /**
     * Check if given friendID is a friend of current User,
     * If Yes, return associated friendRelation object
     * If No, return temporary friendRelation object
     */
    @GetMapping("/friends/checkFriendsStatus/{currUserID}/{targetUserID}")
    public FriendDetails checkFriendsStatus(@PathVariable String currUserID, @PathVariable String targetUserID){

        if(uRepo.findById(targetUserID) == null){
            return null;
        }

        Friend friendRelationList = frRepo.findById(currUserID);
        String name = pRepo.findById(targetUserID).getName();

        if(!friendRelationList.getFriends().isEmpty()){
            for(FriendRelation friendRelationObject : friendRelationList.getFriends()){
                if(friendRelationObject.getFriendUserID().equals(targetUserID)){
                    return new FriendDetails(name, friendRelationObject.getFriendUserID(),friendRelationObject.getStatus(), friendRelationObject.getChatID());
                }
            }
        }

        return new FriendDetails(name, targetUserID, 'N', -1);
    }

    /**
     * Used for creating a Friend relationship for current user
     * Mainly used for testing as Friend entry already created
     * the first time the user logs in
     * @param currUserID
     * @return
     */
    @PostMapping("/friends/{currUserID}")
    public Friend createFriend(@PathVariable String currUserID){
        Friend friend = new Friend();
        friend.setID(currUserID);
        return frRepo.save(friend);
    }

    /**
     * Adds targetUser to friendRelation list of currUser with R status
     * Adds currUser to friendRelation list of targetUser with P status
     * @param currUserID
     * @param targetUserID
     * @return
     */
    @PostMapping("/friends/{currUserID}/{targetUserID}")
    public FriendRelation createFriendRequest(@PathVariable String currUserID, @PathVariable String targetUserID){

        FriendRelation tempCurrUserRelation = new FriendRelation(targetUserID, 'R', -1);
        FriendRelation tempTargetUserRelation = new FriendRelation(currUserID, 'P', -1);

        Friend currUserFriends = frRepo.findById(currUserID);
        Friend targetUserFriends = frRepo.findById(targetUserID);

        currUserFriends.addFriends(tempCurrUserRelation);
        frRepo.save(currUserFriends);

        targetUserFriends.addFriends(tempTargetUserRelation);
        frRepo.save(targetUserFriends);

        return tempCurrUserRelation;
    }

    /**
     * Used for confirming friendRequests
     * @param currUserID
     * @return
     */
    @PutMapping("/friends/{currUserID}/{targetUserID}")
    public FriendDetails confirmFriendRequest( @PathVariable String currUserID, @PathVariable String targetUserID){
        Friend currUser = frRepo.findById(currUserID);
        Friend targetUser = frRepo.findById(targetUserID);
        ChatHistory tempChatHistory = new ChatHistory();
        int generatedChatIDFromDB = chRepo.save(tempChatHistory).getId();

        if(!currUser.getFriends().isEmpty() && !targetUser.getFriends().isEmpty()){
            for(FriendRelation friendRelation : currUser.getFriends()){
                if(friendRelation.getFriendUserID().equals(targetUserID)){
                    friendRelation.setStatus('F');
                    friendRelation.setChatID(generatedChatIDFromDB);
                    frRepo.save(currUser);
                    break;
                }
            }

            for(FriendRelation friendRelation : targetUser.getFriends()){
                if(friendRelation.getFriendUserID().equals(currUserID)){
                    friendRelation.setStatus('F');
                    friendRelation.setChatID(generatedChatIDFromDB);
                    frRepo.save(targetUser);
                    break;
                }
            }
        }

        String name = pRepo.findById(targetUserID).getName();

        return new FriendDetails(name, targetUserID, 'F', generatedChatIDFromDB);
    }

    /**
     * Only allows updates to status and chatID of a friend
     * @param currUserID
     * @param friendRelation
     * @return
     */
    @PutMapping("/friends/{currUserID}")
    public FriendDetails updateFriendDetails(@PathVariable String currUserID, @RequestBody FriendRelation friendRelation){
        Friend currUser = frRepo.findById(currUserID);
        if(!currUser.getFriends().isEmpty()){
            for(FriendRelation tempFriendRelation : currUser.getFriends()){
                if(tempFriendRelation.getFriendUserID().equals(friendRelation.getFriendUserID())){
                    tempFriendRelation.setStatus(friendRelation.getStatus());
                    tempFriendRelation.setChatID(friendRelation.getChatID());
                    frRepo.save(currUser);
                    break;
                }
            }
        }

        String name = pRepo.findById(currUserID).getName();

        return new FriendDetails(name,currUserID, friendRelation.getStatus(), friendRelation.getChatID());
    }

    @DeleteMapping("/friends/{currUserID}/{targetUserID}")
    public ResponseEntity<HttpStatus> removeFriendRelation(@PathVariable String currUserID, @PathVariable String targetUserID){

        Friend currUser = frRepo.findById(currUserID);
        Friend targetUser = frRepo.findById(targetUserID);

        if(!currUser.getFriends().isEmpty() && !targetUser.getFriends().isEmpty()){
            for(FriendRelation friendRelation : currUser.getFriends()){
                if(friendRelation.getFriendUserID().equals(targetUserID)){
                    currUser.getFriends().remove(friendRelation);
                    frRepo.save(currUser);
                    break;
                }
            }

            for(FriendRelation friendRelation : targetUser.getFriends()){
                if(friendRelation.getFriendUserID().equals(currUserID)){
                    targetUser.getFriends().remove(friendRelation);
                    frRepo.save(targetUser);
                    break;
                }
            }
        }

        return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
    }

}
