package com.example.demo.Controller;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.FollowingUserService;
import com.example.demo.Service.ProfileService;
import com.example.demo.Service.ProfileStatisticsService;
import com.example.demo.Service.UserService;
import com.example.demo.model.FollowingUser;
import com.example.demo.model.Profile;
import com.example.demo.model.ProfileStatistics;
import com.example.demo.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProfileController {
    private final ProfileService profileService;
    private final UserService userService;
    private final ProfileStatisticsService profileStatisticsService;
    private final FollowingUserService followingUserService;

    @Autowired
    public ProfileController(ProfileService profileService, UserService userService, ProfileStatisticsService profileStatisticsService, FollowingUserService followingUserService) {
        this.profileService = profileService;
        this.userService = userService;
        this.profileStatisticsService = profileStatisticsService;
        this.followingUserService = followingUserService;
    }



    @PostMapping("/followUser")
    public ResponseEntity<Map<String, String>> followUser(@RequestBody  Map<String, String> userFollowEmail) {
        Map<String, String> response = new HashMap<>();

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return null;
            }
            String email = authentication.getName();
            Optional<User> user = userService.findByEmail(email);

            if(user.isPresent()){
                List<FollowingUser> followingUser = followingUserService.findByFollowingUserEmail(userFollowEmail.get("email"));
                System.out.println("followingUser = " + followingUser);
                if(!followingUser.isEmpty()){
                    response.put("message", "Can not follow user");
                    return ResponseEntity.ok(response);
                }
            }

            if(!followingUserService.findByFollowingUserEmail(userFollowEmail.get("email")).isEmpty()){
                response.put("message", "Can not follow user");
                return ResponseEntity.ok(response);
            }

            Optional<User> userFollow = userService.findByEmail(userFollowEmail.get("email"));

            if(userFollow.isEmpty()){
                response.put("message", "Can not follow user");
                return ResponseEntity.ok(response);
            }

            Profile followProfile = userFollow.get().getProfile();

            followingUserService.save(userFollowEmail.get("email"), user.get());
            ProfileStatistics profileStatistics = followProfile.getStatistics();
            profileStatistics.setFollowers(profileStatistics.getFollowers() + 1);
            profileStatisticsService.save(profileStatistics);

            response.put("message", "success");
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/countOfFollowers")
    public ResponseEntity<Map<String, Integer>> showCountOfFollows() {
        Map<String, Integer> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        User user = userService.findByEmail(authentication.getName()).get();
        if(user != null){
            int countOfFollows = user.getProfile().getStatistics().getFollowers();
            response.put("countOfFollows", countOfFollows);
        }else{
            return null;
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bio")
    public ResponseEntity<Map<String, String>> showBiography(){
        Map<String, String> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        try{
            User user = userService.findByEmail(authentication.getName()).get();
            String Bio = user.getProfile().getBiography();
            response.put("Bio", Bio);
        }catch(Exception e){
            response.put("Bio", "error: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }



}
