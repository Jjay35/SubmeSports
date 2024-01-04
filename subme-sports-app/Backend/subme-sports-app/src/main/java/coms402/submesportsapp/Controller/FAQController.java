package coms402.submesportsapp.Controller;

import coms402.submesportsapp.Model.FAQ;
import coms402.submesportsapp.Repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FAQController {
    @Autowired
    private FAQRepository fRepo;

    /**
    Gets all FAQ Objects in the database
     **/
    @GetMapping("/faqs")
    public List<FAQ> getAllFaqs(){
        return fRepo.findAll();
    }

    /**
    Passes through a FAQ to save to the list of current FAQ's
     **/
    @PostMapping("/faqs")
    public FAQ saveFaqDetails(@RequestBody FAQ faq){
        return fRepo.save(faq);
    }

    /**
     Gets an FAQ by a specific ID
     **/
    @GetMapping("/faqs/{id}")
    public FAQ getFaqById(@PathVariable int id ){
        return fRepo.findById(id);
    }

    /**
     Updates a given FAQ in the current list of FAQ's
     **/
    @PutMapping("/faqs")
    public FAQ updateFaqDetails(@RequestBody FAQ faq){
        return fRepo.save(faq);
    }

    /**
     Gets rid of a selected FAQ with an ID
     **/
    @DeleteMapping("/faqs/{id}")
    public ResponseEntity<HttpStatus> deleteFaqById(@PathVariable int id){
        fRepo.deleteById(id);
        return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
    }
}