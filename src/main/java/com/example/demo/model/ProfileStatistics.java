package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class ProfileStatistics {
    public ProfileStatistics() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int followers;
    private int countOfLikes;
    private int countOfPosts;

    @OneToOne(mappedBy = "statistics")
    private Profile profil;

    public ProfileStatistics(int followers, int countOfLikes, int countOfPosts) {
        this.followers = followers;
        this.countOfLikes = countOfLikes;
        this.countOfPosts = countOfPosts;
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
}
