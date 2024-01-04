package coms402.submesportsapp.Controller;

import coms402.submesportsapp.Model.Profile;
import coms402.submesportsapp.Repository.ProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class ProfileController {

    @Autowired
    ProfileRepository profRep;

    /**
     Gets all profiles in the database
     **/
    @GetMapping(path = "/profile")
    List<Profile> getAllProfiles()
    {
        return profRep.findAll();
    }

    /**
     Gets all profile objects passing through an id string to return the speciifc profile under that id
     **/
    @GetMapping(path = "/profile/{id}")
    Profile getProfileById(@PathVariable String id)
    {
        return profRep.findById(id);
    }

    /**
     * Creates a profile by passing through a profile object and inserting into the database
     **/
    @PostMapping(path = "/profile")
    Profile createProfile(@RequestBody Profile profile)
    {
        profRep.save(profile);
        return profile;
    }

    /**
     Updates a selected profile by id along with passing in the new updated version of the profile object
     **/
    @PutMapping(path = "/profile/{id}")
    Profile updateProfile(@PathVariable String id, @RequestBody Profile update)
    {
        if(profRep.findById(id) == null)
        {
            return null;
        }
        profRep.save(update);
        return profRep.findById(id);
    }

    /**
     Gets rid of a selected profile inside of the database using a speciifc ID
     **/
    @DeleteMapping(path = "/profile/{id}")
    List<Profile> deleteProfile(@PathVariable String id)
    {
        profRep.deleteById(id);
        return profRep.findAll();
    }

}