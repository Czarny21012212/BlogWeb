package com.example.demo.Controller;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.ProfileService;
import com.example.demo.Service.ProfileStatisticsService;
import com.example.demo.Service.UserService;
import com.example.demo.model.Profile;
import com.example.demo.model.ProfileStatistics;
import com.example.demo.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProfileController {
    private final ProfileService profileService;
    private final UserService userService;
    private final ProfileStatisticsService profileStatisticsService;

    @Autowired
    public ProfileController(ProfileService profileService, UserService userService, ProfileStatisticsService profileStatisticsService) {
        this.profileService = profileService;
        this.userService = userService;
        this.profileStatisticsService = profileStatisticsService;
    }

    @PostMapping("/createProfile")
    public ResponseEntity<Map<String, String>> createProfile(@RequestBody Profile profile) {
        Map<String, String> response = new HashMap<>();

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> user = userService.findByEmail(email);
            profile.setUser(user.get());
            profileService.save(profile);
            ProfileStatistics profileStatistics = new ProfileStatistics();
            profileStatistics.setProfile(profile);
            profileStatisticsService.save(profileStatistics);
        }catch(Exception e){
            response.put("message", "error" + e.getMessage());
        }
        return ResponseEntity.ok(response);

    }

    @PostMapping("/followUser")
    public ResponseEntity<Map<String, String>> followUser(@RequestBody  Map<String, String> userFollowEmail) {
        Map<String, String> response = new HashMap<>();

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<User> user = userService.findByEmail(email);

            Optional<User> userFollow = userService.findByEmail(userFollowEmail.get("email"));

            if(userFollow.isEmpty()){
                response.put("message", "Can not follow user");
            }

            Profile followProfile = userFollow.get().getProfile();

            ProfileStatistics profileStatistics = followProfile.getStatistics();
            profileStatistics.setFollowers(profileStatistics.getFollowers() + 1);
            profileStatisticsService.save(profileStatistics);

            response.put("message", "success");
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
        }
        return ResponseEntity.ok(response);

    }



}
