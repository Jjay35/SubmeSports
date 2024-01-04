package coms402.submesportsapp.Model;


import jakarta.persistence.*;

@Entity
@Table(name = "FAQ")

public class FAQ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String question;
    private String answer;

    public FAQ(String question, String answer)
    {
        this.question = question;
        this.answer = answer;
    }
    public FAQ() { }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getQuestion() {return question;}
    public void setQuestion(String question) {this.question = question;}

    public String getAnswer() {return answer;}
    public void setAnswer(String answer) {this.answer = answer;}






}
