package com.example.demo.Service;

import com.example.demo.Repository.CommentsRepository;
import com.example.demo.model.Comments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentsService {
    private final CommentsRepository commentsRepository;

    @Autowired
    public CommentsService(CommentsRepository commentsRepository) {
        this.commentsRepository = commentsRepository;
    }

    public void save(Comments comments) {
        commentsRepository.save(comments);
    }
}
