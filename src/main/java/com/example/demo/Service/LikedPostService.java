package com.example.demo.Service;

import com.example.demo.Repository.LikedPostRepository;
import com.example.demo.model.LikedPost;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;

@Service
public class LikedPostService {
    private final LikedPostRepository likedPostRepository;

    public LikedPostService(LikedPostRepository likedPostRepository) {
        this.likedPostRepository = likedPostRepository;
    }

    public void save(LikedPost likedPost) {
        likedPostRepository.save(likedPost);
    }
}
