package com.example.demo.Controller;

import com.example.demo.Repository.LikeRepository;
import com.example.demo.Repository.LikedPostRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.LikeService;
import com.example.demo.Service.LikedPostService;
import com.example.demo.model.Like;
import com.example.demo.model.LikedPost;
import com.example.demo.model.Post;
import com.example.demo.Repository.PostRepository;
import com.example.demo.Service.PostService;
import com.example.demo.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.demo.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


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

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, PostService postService, PostRepository postRepository, PostService postService1, UserRepository userRepository, LikedPostService likedPostService, LikedPostRepository likedPostRepository, LikeService likeService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.postRepository = postRepository;
        this.postService = postService1;
        this.userRepository = userRepository;
        this.likedPostService = likedPostService;
        this.likedPostRepository = likedPostRepository;
        this.likeService = likeService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        try{
            if(userService.findByEmail(user.getEmail()).isEmpty()){
                userService.save(user);
                response.put("message", "success");
            }else{
                response.put("message", "Something went wrong");
            }
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
            ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
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
            Like like = likeService.save(0);
            post.setLike(like);
            post.setUser(user);
            postService.save(post);
            System.out.println(post.getId());
            return ResponseEntity.ok(response);
        }catch(Exception e){
            response.put("message", "error: " + e.getMessage());
            ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-post")
    public List<Post> allPost() {
        return postRepository.findAll();
    }

    @GetMapping("/my-post")
    public List<Post> myPost(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(authentication.getName()).get();
        return postService.findMyPost(user.getId());
    }

    @GetMapping("/my-data")
    public User myData(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(authentication.getName()).get();
        return user;
    }

    @PostMapping("/likePost")
    public ResponseEntity<Map<String, String>> likePost(@RequestBody LikedPost likedPost, HttpServletRequest request) {
        Map<String, String> response = new HashMap<>();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return null;
            }

            User user = userService.findByEmail(authentication.getName()).get();
            Long likedPostId = likedPost.getLikedPostId();
            Optional<LikedPost> post = likedPostService.findByUserAndLikedPostId(user, likedPostId);

            if(post.isEmpty()){
                likedPost.setUser(user);
                likedPostService.save(likedPost);
                Post post1 = postService.findById(likedPostId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));
                Like like = post1.getLike();
                System.out.println(like.getId());
                like.setLikes(like.getLikes() + 1);
                likeService.save(like.getLikes());
                response.put("message", "succes");
            }else{
                response.put("message", "something went wrong");
            }

            return ResponseEntity.ok(response);

    }



}
