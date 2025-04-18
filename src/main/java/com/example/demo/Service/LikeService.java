package com.example.demo.Service;

import com.example.demo.Repository.LikeRepository;
import com.example.demo.model.Like;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public Like save(int likeCount) {
        Like like = new Like(likeCount);
        return likeRepository.save(like);
    }
}
