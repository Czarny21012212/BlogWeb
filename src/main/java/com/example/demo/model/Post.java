package com.example.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Post {
    public Post(){}
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private String author;
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "post")
    private Like likes;

    @OneToMany(mappedBy = "post")
    private List<Comments> comments;

    public Post(String title, String author, String content) {
        this.title = title;
        this.author = author;
        this.content = content;
    }

    public List<Comments> getComments() {return comments;}
    public void setComments(List<Comments> comments) {this.comments = comments;}

    public Like getLikes() {
        return likes;
    }
    public void setLikes(Like likes) {
        this.likes = likes;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {this.id = id;}

    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

}
