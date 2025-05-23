package com.example.demo.Repository;

import com.example.demo.model.FollowingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowingUserRepository extends JpaRepository<FollowingUser, Long> {
    List<FollowingUser> findByFollowingUserEmail(String followingUserEmail);
}
