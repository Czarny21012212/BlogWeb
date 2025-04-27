package com.example.demo.Service;

import com.example.demo.Repository.FollowingUserRepository;
import com.example.demo.model.FollowingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowingUserService {
    private final FollowingUserRepository followingUserRepository;

    @Autowired
    public FollowingUserService(FollowingUserRepository followingUserRepository) {
        this.followingUserRepository = followingUserRepository;
    }

    public List<FollowingUser> findByFollowingUserEmail(String FollowingUserEmail) {
        return followingUserRepository.findByFollowingUserEmail(FollowingUserEmail);
    }

    public void save(FollowingUser followingUser) {
        followingUserRepository.save(followingUser);
    }

}
