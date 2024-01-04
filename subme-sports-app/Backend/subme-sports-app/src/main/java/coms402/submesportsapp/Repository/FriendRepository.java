package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.FAQ;
import coms402.submesportsapp.Model.Friend;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long>{

    @Transactional
    Friend findById(String id);
}
