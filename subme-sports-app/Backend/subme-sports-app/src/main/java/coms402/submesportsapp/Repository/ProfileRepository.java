package coms402.submesportsapp.Repository;

import coms402.submesportsapp.Model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

public interface ProfileRepository extends JpaRepository<Profile, Long>
{
    Profile findById(String id);

    @Transactional
    void deleteById(String id);
}
