package com.example.demo.Repository;

import com.example.demo.model.LikedPost;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikedPostRepository extends JpaRepository<LikedPost, Long> {
    Optional<LikedPost> findLikedPostByUserAndPost(Long user_id, Long likedPostId);
}
