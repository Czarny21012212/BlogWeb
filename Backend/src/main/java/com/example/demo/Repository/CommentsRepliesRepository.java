package com.example.demo.Repository;

import com.example.demo.model.Comments;
import com.example.demo.model.CommentsReplies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepliesRepository extends JpaRepository<CommentsReplies, Long> {
    List<CommentsReplies> findByComments_Id(Long commentId);
}
