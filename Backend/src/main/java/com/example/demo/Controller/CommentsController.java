package com.example.demo.Controller;

import com.example.demo.Service.CommentsService;
import com.example.demo.Service.PostService;
import com.example.demo.model.Comments;
import com.example.demo.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class CommentsController {
    private final CommentsService commentsService;
    private final PostService postService;

    @Autowired
    public CommentsController(CommentsService commentsService, PostService postService) {
        this.commentsService = commentsService;
        this.postService = postService;
    }

    @PostMapping("/comment")
    public ResponseEntity<Map<String, String>> addComment(@RequestBody Map<String, Object> commentData) {
        Map<String, String> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication==null){
            response.put("status", "error");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        try {

            Optional<Post> post = postService.findById(Long.valueOf((Integer) commentData.get("post_id")));

            if(post.isPresent()){
                Comments comment = new Comments((String) commentData.get("content"), (String) commentData.get("publicationDate"));
                comment.setPost(post.get());

                commentsService.save(comment);
                response.put("status", "success");
            }

        }catch(Exception e) {
            response.put("message", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth-check")
    public ResponseEntity<?> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(Map.of(
                "authenticated", authentication != null && authentication.isAuthenticated(),
                "name", authentication != null ? authentication.getName() : "anonymous"
        ));
    }


    @PostMapping("/showCommetns")
    public List<Map<String, Object>> showComments(@RequestBody Map<String, Long> postData) {
        Map<String, String> response = new HashMap<>();

        try{
            Long postId = postData.get("post_id");
            Optional<Post> post = postService.findById(postId);
            if(post.isPresent()){
                List<Comments> comments = commentsService.findAllComments(postId);

                return comments.stream()
                        .map(comment -> {
                            Map<String, Object> commentMap = new HashMap<>();
                            commentMap.put("content", comment.getContent());
                            commentMap.put("publicationDate", comment.getPublicationDate());
                            commentMap.put("userName", comment.getPost().getUser().getProfile().getUserName());
                            return commentMap;
                        })
                        .collect(Collectors.toList());

            }
        }catch(Exception e) {
            response.put("message", e.getMessage());
            return null;
        }
        return null;

    }
}
