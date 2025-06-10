package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class FollowingUser {
    public FollowingUser() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String followingUserEmail;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public FollowingUser(String followingUserEmail, User user) {
        this.followingUserEmail = followingUserEmail;
        this.user = user;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getFollowingUserEmail() {
        return followingUserEmail;
    }
    public void setFollowingUserEmail(String followingUserEmail) {
        this.followingUserEmail = followingUserEmail;
    }
}
