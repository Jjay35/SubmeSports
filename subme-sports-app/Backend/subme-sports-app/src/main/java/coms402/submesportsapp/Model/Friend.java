package coms402.submesportsapp.Model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Friend")
public class Friend {

    @Id
    private String id;

    @OneToMany(cascade = CascadeType.ALL)
    List<FriendRelation>friends = new ArrayList<FriendRelation>();

    public Friend(){}

    public String getID() {return  id;}

    public void setID( String userID){this.id = userID;}

    public List<FriendRelation> getFriends() {return this.friends;}

    public void addFriends(FriendRelation friendRelation){friends.add(friendRelation);}

}
