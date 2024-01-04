package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long>
{
    Game findById(int id);

    @Transactional
    void deleteById(int id);

    List<Game> findAll();

}
