package com.example.demo.Service;

import com.example.demo.Repository.LikeRepository;
import com.example.demo.model.Like;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    private final LikeRepository likeRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public void save(Like like) {
        likeRepository.save(like);
    }

}
