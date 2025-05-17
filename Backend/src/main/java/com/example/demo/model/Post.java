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
    private String publicationDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Like likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comments> comments;

    public Post(String title, String content, String publicationDate) {
        this.title = title;
        this.content = content;
        this.publicationDate = publicationDate;
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

    public String getPublicationDate() {return publicationDate;}
    public void setPublicationDate(String publicationDate) {this.publicationDate = publicationDate;}

}
