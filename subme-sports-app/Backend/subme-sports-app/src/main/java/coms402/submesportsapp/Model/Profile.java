package coms402.submesportsapp.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "Profile")
public class Profile
{
    @Id
    private String id;
    private String quote;
    private String name;
    private boolean hideAge;
    private int age;
    private int[] sportPref;
    private int[] pillars;
    private String education;
    private String work;
    private String interests;
    private int gameDist;


    public Profile(String name, int age, String quote)
    {
        this.name = name;
        this.age = age;
        this.quote = quote;
    }

    public Profile() { }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getHideAge(){return hideAge;}

    public void setHideAge(Boolean hideAge){this.hideAge = hideAge;}

    public int getAge() {return age;}

    public String getQuote() {return quote;}

    public String getEducation() {return education;}

    public String getWork() {return work;}

    public int[] getPillars() {return pillars;}

    public String getInterests() {return interests;}

    public void setGameDist(int gameDist){this.gameDist = gameDist;}
    public int getGameDist() {return gameDist;}

    public int[] getSportPref() {return sportPref;}
}
