package com.example.demo.Repository;

import com.example.demo.model.FollowingUser;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowingUserRepository extends JpaRepository<FollowingUser, Long> {
    List<FollowingUser> findByFollowingUserEmail(String followingUserEmail);
    long deleteByUserAndFollowingUserEmail(User user, String followingUserEmail);


}
