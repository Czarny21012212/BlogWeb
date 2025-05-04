package com.example.demo.Service;

import com.example.demo.Repository.CommentsRepliesRepository;
import com.example.demo.model.CommentsReplies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentsRepliesService {
    private final CommentsRepliesRepository repliesRepository;

    @Autowired
    public CommentsRepliesService(CommentsRepliesRepository repliesRepository) {
        this.repliesRepository = repliesRepository;
    }

    public void save(CommentsReplies replies) {
        repliesRepository.save(replies);
    }

    public List<CommentsReplies> findByCommentId(Long commentId) {
        return repliesRepository.findByComments_Id(commentId);
    }
}
