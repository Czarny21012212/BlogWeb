package com.example.demo.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    public User(){}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String email;
    private String password;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<LikedPost> likedPosts = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<FollowingUser> followingUsers = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    private Profile profile;


    public User(String email, String password){
        this.email = email;
        this.password = password;
    }

    public List<Post> getPosts(){
        return posts;
    }

    public List<LikedPost> getLikedPosts(Long likedPostId){
        return likedPosts;
    }

    public List<FollowingUser> getFollowingUsers(){return followingUsers;}

    public Profile getProfile(){
        return profile;
    }
    public void setProfile(Profile profile){
        this.profile = profile;
    }

    public void setEmail(String email){
        this.email = email;
    }
    public void setPassword(String password){
        this.password = password;
    }

    public Long getId(){
        return id;
    }
    public String getEmail(){
        return email;
    }
    public String getPassword(){
        return password;
    }

}
