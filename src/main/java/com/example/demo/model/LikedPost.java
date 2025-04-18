package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class LikedPost {
    public LikedPost() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long likedPostId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public LikedPost(Long likedPostId) {
        this.likedPostId = likedPostId;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getLikedPostId() {
        return likedPostId;
    }
    public void setLikedPostId(Long likedPostId) {
        this.likedPostId = likedPostId;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

}
