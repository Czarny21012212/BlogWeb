package com.example.demo.Service;

import com.example.demo.Repository.FollowingUserRepository;
import com.example.demo.model.FollowingUser;
import com.example.demo.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void save(String followingUserEmail, User user) {
        FollowingUser followingUser = new FollowingUser(followingUserEmail, user);
        followingUserRepository.save(followingUser);
    }

    @Transactional
    public long unFollow(String followingUserEmail, User user) {
        return followingUserRepository.deleteByUserAndFollowingUserEmail(user, followingUserEmail);
    }


}
