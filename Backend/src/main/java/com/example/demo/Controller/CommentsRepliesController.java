package com.example.demo.Controller;

import com.example.demo.Service.CommentsRepliesService;
import com.example.demo.Service.CommentsService;
import com.example.demo.Service.PostService;
import com.example.demo.model.Comments;
import com.example.demo.model.CommentsReplies;
import com.example.demo.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommentsRepliesController {
    private final CommentsRepliesService commentsRepliesService;
    private final CommentsService commentsService;

    @Autowired
    public CommentsRepliesController(CommentsRepliesService service, PostService postService, CommentsService commentsService) {
        this.commentsRepliesService = service;

        this.commentsService = commentsService;
    }

    @PostMapping("/comments-replies")
    public ResponseEntity<Map<String, String>> commentReplies(@RequestBody Map<String, Object> commentData) {
        Map<String, String> response = new HashMap<>();
        System.out.println(commentData.get("comment_id"));
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if(authentication==null){
                response.put("status", "error");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }

            Comments comments = commentsService.findById(Long.valueOf((Integer) commentData.get("comment_id")));

            if(comments!=null){
                CommentsReplies commentsReplies = new CommentsReplies((String)commentData.get("content"), (String)commentData.get("publicationDate"));
                commentsReplies.setComments(comments);
                commentsRepliesService.save(commentsReplies);

                response.put("status", "success");
            }

        }catch(Exception e) {
            response.put("status", e.getMessage());
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/show-comments-replies")
    public List<Map<String, Object>> showCommentReplies(@RequestBody Map<String, Long> response) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if(authentication==null){
                return new ArrayList<>();
            }

            List<CommentsReplies> commentsReplies = commentsRepliesService.findByCommentId(response.get("comment_id"));

            return commentsReplies.stream()
                    .map(commentReplies -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("content", commentReplies.getContent());
                        map.put("publicationDate", commentReplies.getPublicationDate());
                        map.put("userName", commentReplies.getComments().getPost().getUser().getProfile().getUserName());
                        return map;
                    })
                    .collect(Collectors.toList());

        }catch(Exception e){
            return new ArrayList<>();
        }
    }

}
