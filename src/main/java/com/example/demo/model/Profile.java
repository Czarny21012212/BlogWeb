package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Profile {
    public Profile() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String userName;
    private String biography;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profilStatistics_id", nullable = false)
    private ProfileStatistics statistics;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    public Profile(String userName, String biography) {
        this.userName = userName;
        this.biography = biography;
    }

    public ProfileStatistics getStatistics() {
        return statistics;
    }
    public void setStatistics(ProfileStatistics statistics) {
        this.statistics = statistics;
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
