package com.example.demo.Service;

import com.example.demo.Repository.CommentsRepository;
import com.example.demo.model.Comments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<Comments> findAllComments(Long id) {
        return commentsRepository.findByPostId(id);
    }

    public Comments findById(Long id) {
        return commentsRepository.findById(id).orElse(null);
    }
}
