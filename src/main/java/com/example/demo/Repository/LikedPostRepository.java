package com.example.demo.Repository;

import com.example.demo.model.LikedPost;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikedPostRepository extends JpaRepository<LikedPost, Long> {
    Optional<LikedPost> findByUserAndLikedPostId(User user, Long likedPostId);
}
