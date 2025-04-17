package com.example.demo.model;

import com.example.demo.model.User;
import jakarta.persistence.*;

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

    public Post(String title, String author, String content) {
        this.title = title;
        this.author = author;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
