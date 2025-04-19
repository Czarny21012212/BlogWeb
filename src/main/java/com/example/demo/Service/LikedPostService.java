package com.example.demo.Service;

import com.example.demo.Repository.LikedPostRepository;
import com.example.demo.model.LikedPost;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikedPostService {
    private final LikedPostRepository likedPostRepository;

    public List<LikedPost> findByUserAndLikedPostId(User user, Long likedPost) {
        System.out.println("Liked Post " + likedPost);
        System.out.println("User " + user.getId());
        return likedPostRepository.findByUserAndLikedPostId(user, likedPost);
    }

    public LikedPostService(LikedPostRepository likedPostRepository) {
        this.likedPostRepository = likedPostRepository;
    }

    public void save(LikedPost likedPost) {
        likedPostRepository.save(likedPost);
    }
}
