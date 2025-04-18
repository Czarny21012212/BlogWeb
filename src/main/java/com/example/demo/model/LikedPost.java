package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class LikedPost {
    public LikedPost() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int likedPostId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public LikedPost(int likedPostId, User user) {
        this.likedPostId = likedPostId;
        this.user = user;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public int getLikedPostId() {
        return likedPostId;
    }
    public void setLikedPostId(int likedPostId) {
        this.likedPostId = likedPostId;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

}
