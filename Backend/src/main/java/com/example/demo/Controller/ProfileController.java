package com.example.demo.Controller;

import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.*;
import com.example.demo.model.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ProfileController {
    private final ProfileService profileService;
    private final UserService userService;
    private final ProfileStatisticsService profileStatisticsService;
    private final FollowingUserService followingUserService;
    private final PostService postService;

    @Autowired
    public ProfileController(ProfileService profileService, UserService userService, ProfileStatisticsService profileStatisticsService, FollowingUserService followingUserService, PostService postService) {
        this.profileService = profileService;
        this.userService = userService;
        this.profileStatisticsService = profileStatisticsService;
        this.followingUserService = followingUserService;
        this.postService = postService;
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
            Profile profile = user.getProfile();
            String bio = profile.getBiography();
            response.put("Bio", bio);
        }catch(Exception e){
            response.put("Bio", "error: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/userData/{id}")
    public List<Map<String, Object>> showUserAccount(@PathVariable Long id){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")){
            return null;
        }

        User user = userService.findById(id).get();
        List<Map<String, Object>> response = new ArrayList<>();

        Map<String, Object> responseMap = new HashMap<>();

        responseMap.put("id", user.getId());
        responseMap.put("bio", user.getProfile().getBiography());
        responseMap.put("userName", user.getProfile().getUserName());
        responseMap.put("email", user.getEmail());
        responseMap.put("countOfLikes", user.getProfile().getStatistics().getCountOfLikes());
        responseMap.put("countOfFollowers", user.getProfile().getStatistics().getFollowers());
        response.add(responseMap);

        return response;
    }
    @GetMapping("/userPosts/{id}")
    public List<Map<String, Object>> showUserPosts(@PathVariable Long id){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")){
            return null;
        }

        List<Map<String, Object>> response = new ArrayList<>();

        List<Post> posts = postService.findMyPost(Long.valueOf(id));

        for(Post post : posts){
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", postService.getPostId(post));
            postData.put("title", post.getTitle());
            postData.put("author", post.getAuthor());
            postData.put("content", post.getContent());
            postData.put("publicationDate", post.getPublicationDate());
            response.add(postData);
        }
        return response;
    }

    @PostMapping("/addBio")
    public ResponseEntity<Map<String, String>> addBio(@RequestBody Map<String, String> bio){
        Map<String, String> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")){
            response.put("message", "unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userService.findByEmail(authentication.getName()).get();
        String newBio = bio.get("bio");
        if(newBio.isEmpty() || newBio.length() > 30){
            response.put("message", "The bio is too long (max 30 characters)");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Profile profile = user.getProfile();
        profile.setBiography(bio.get("bio"));
        profileService.save(profile);
        user.setProfile(profile);
        response.put("message", "success");


        return ResponseEntity.ok(response);

    }

    @PostMapping("/changeUserName")
    public ResponseEntity<Map<String, String>> changeUserName(@RequestBody Map<String, String> UserName){
        Map<String, String> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")){
            response.put("message", "unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = userService.findByEmail(authentication.getName()).get();
        if(user == null){
            response.put("message", "unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return profileService.ChangeUsername(UserName.get("userName"), user);

    }









}
