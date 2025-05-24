package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Profile {
    public Profile() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String userName;
    @Column(nullable = false)
    private String biography = "";


    @OneToOne(mappedBy = "profile", cascade = CascadeType.ALL)
    private ProfileStatistics statistics;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    public Profile(String userName) {
        this.userName = userName;
        this.biography = "";
    }


    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public ProfileStatistics getStatistics() {
        return statistics;
    }
    public void setStatistics(ProfileStatistics statistics) {
        this.statistics = statistics;
        if (statistics != null && statistics.getProfile() != this) {
            statistics.setProfile(this);
        }
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getBiography() {
        return biography;
    }
    public void setBiography(String biography) {
        this.biography = biography;
    }





}
