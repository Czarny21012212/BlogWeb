package com.example.demo.model;

import jakarta.persistence.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Entity
public class ProfileStatistics {
    public ProfileStatistics() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(columnDefinition = "INT DEFAULT 0")
    private int followers;
    @Column(columnDefinition = "INT DEFAULT 0")
    private int countOfLikes;
    @Column(columnDefinition = "INT DEFAULT 0")
    private int countOfPosts;

    @OneToOne
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    public ProfileStatistics(Profile profile) {
        this.profile = profile;
        this.followers = 0;
        this.countOfLikes = 0;
        this.countOfPosts = 0;
    }

    public Profile getProfile() {
        return profile;
    }
    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public int getFollowers() {
        return followers;
    }
    public void setFollowers(int followers) {
        this.followers = followers;
    }

    public int getCountOfLikes() {
        return countOfLikes;
    }
    public void setCountOfLikes(int countOfLikes) {
        this.countOfLikes = countOfLikes;
    }

    public int getCountOfPosts() {
        return countOfPosts;
    }
    public void setCountOfPosts(int countOfPosts) {
        this.countOfPosts = countOfPosts;
    }
}
