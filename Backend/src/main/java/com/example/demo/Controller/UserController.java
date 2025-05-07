package com.example.demo.Controller;

import com.example.demo.Repository.LikedPostRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.*;
import com.example.demo.model.*;
import com.example.demo.Repository.PostRepository;
import com.fasterxml.jackson.databind.ser.std.StdKeySerializers;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final PostRepository postRepository;
    private final PostService postService;
    private final UserRepository userRepository;
    private final LikedPostService likedPostService;
    private final LikedPostRepository likedPostRepository;
    private final LikeService likeService;
    private final ProfileService profileService;
    private final ProfileStatisticsService profileStatisticsService;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, PostService postService, PostRepository postRepository, PostService postService1, UserRepository userRepository, LikedPostService likedPostService, LikedPostRepository likedPostRepository, LikeService likeService, ProfileService profileService, ProfileStatisticsService profileStatisticsService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.postRepository = postRepository;
        this.postService = postService1;
        this.userRepository = userRepository;
        this.likedPostService = likedPostService;
        this.likedPostRepository = likedPostRepository;
        this.likeService = likeService;
        this.profileService = profileService;
        this.profileStatisticsService = profileStatisticsService;
    }

    @PostMapping("/register-2")
    public ResponseEntity<Map<String, String>> register2(@RequestBody Map<String, Object> request) {
        Map<String, String> response = new HashMap<>();

        try{
            if(!request.containsKey("email") || !request.containsKey("password") || !request.containsKey("username")){
                response.put("message", "Missing required fields");
                return ResponseEntity.badRequest().body(response);
            }

            String email = request.get("email").toString().trim();
            String password = request.get("password").toString();
            String username = request.get("username").toString().trim();

            User user = new User(email, password);
            Profile profile = new Profile(username);

            if(userService.findByEmail(user.getEmail()).isPresent()) {
                response.put("message", "Something went wrong");
                return ResponseEntity.ok(response);
            }

            userService.createUserWithProfile(user, profile);

            response.put("message", "success");
            return ResponseEntity.ok(response);

        }catch(Exception e){
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            response.put("message", "success");
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-post")
    public ResponseEntity<Map<String, String>> addPost(@RequestBody Post post, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                response.put("message", "You are not logged in");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String email = authentication.getName();
            User user = userService.findByEmail(email).get();
            post.setUser(user);
            postService.save(post);
            Like like = new Like(0);
            like.setPost(post);
            likeService.save(like);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
            ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-post")
    public List<Map<String, Object>> allPost() {
        List<Map<String, Object>> response = new ArrayList<>();
        List<Post> posts =  postRepository.findAll();

        for(Post post : posts ){
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", postService.getPostId(post));
            postData.put("content", post.getContent());
            postData.put("author", post.getAuthor());
            postData.put("title", post.getTitle());
            response.add(postData);
        }
        return response;
    }

    @GetMapping("/my-post")
    public List<Map<String, Object>> myPost(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        User user = userService.findByEmail(authentication.getName()).get();
        List<Post> posts = postService.findMyPost(user.getId());

        List<Map<String, Object>> response = new ArrayList<>();
        for (Post post : posts) {
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", postService.getPostId(post));
            postData.put("title", post.getTitle());
            postData.put("author", post.getAuthor());
            postData.put("content", post.getContent());
            response.add(postData);
        }
        return response;
    }

    @GetMapping("/my-data")
    public User myData(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(authentication.getName()).get();
        return user;
    }

    @PostMapping("/likePost")
    public ResponseEntity<Map<String, String>> likePost(@RequestBody LikedPost likedPost) {
            Map<String, String> response = new HashMap<>();

           try{
               Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
               if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                   return null;
               }

               User user = userService.findByEmail(authentication.getName()).get();
               Long likedPostId = likedPost.getLikedPostId();
               System.out.println("Post Id: " + likedPostId);
               Optional<LikedPost> post = likedPostService.findByUserAndLikedPostId(user, likedPostId);

               if(post.isEmpty()){
                   likedPost.setUser(user);
                   likedPostService.save(likedPost);
                   Post post1 = postService.findById(likedPostId)
                           .orElseThrow(() -> new RuntimeException("Post not found"));
                   Like like = post1.getLikes();
                   like.setLikes(like.getLikes() + 1);
                   likeService.save(like);
                   response.put("message", "succes");
               }else{
                   response.put("message", "something went wrong");
               }
               return ResponseEntity.ok(response);

           }catch(Exception e){
               response.put("message", "error: " + e.getMessage());
               ResponseEntity.badRequest().body(response);
           }
           return ResponseEntity.ok(response);
    }

    @PostMapping("/delete-post")
    public Boolean deletePost(@RequestBody Map<String, Long> dataPost, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();

        System.out.println(dataPost.get("post_id"));

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return false;
            }
            User user = userService.findByEmail(authentication.getName()).get();
            Long postId = dataPost.get("post_id");
            Post post = postService.findById(postId).get();

            if(Objects.equals(post.getUser().getId(), user.getId())){
                postService.deleteById(postId);
                return true;
            }
            else return false;

        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
        }
        return false;
    }
}
