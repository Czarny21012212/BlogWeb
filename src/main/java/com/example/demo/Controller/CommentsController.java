package com.example.demo.Controller;

import com.example.demo.Service.CommentsService;
import com.example.demo.Service.PostService;
import com.example.demo.Service.UserService;
import com.example.demo.model.Comments;
import com.example.demo.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.xml.stream.events.Comment;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        System.out.println(commentData.get("post_id"));

        try {
            Optional<Post> post = postService.findById(Long.valueOf((Integer) commentData.get("post_id")));

            if(post.isPresent()){
                Comments comment = new Comments((String) commentData.get("content"), (String) commentData.get("publicationDate"));
                comment.setPost(post.get());

                commentsService.save(comment);
                response.put("status", "ok");
            }

        }catch(Exception e) {
            response.put("message", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}
