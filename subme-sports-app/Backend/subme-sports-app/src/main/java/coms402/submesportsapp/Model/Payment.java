package coms402.submesportsapp.Model;

//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "Payment")

public class Payment {

    @Id
    private String id;

    public Payment() {}


}
