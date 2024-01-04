package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.Payment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

//import jakarta.transaction.Transactional;

public interface PaymentRepository extends JpaRepository<Payment, Long>
{

}
