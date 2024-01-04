package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.FAQ;
import coms402.submesportsapp.Model.Game;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

//import jakarta.transaction.Transactional;

public interface FAQRepository extends JpaRepository<FAQ, Long>
{
    FAQ findById(int id);

    @Transactional
    void deleteById(int id);

}
