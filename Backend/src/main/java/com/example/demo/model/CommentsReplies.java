package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class CommentsReplies {
    public CommentsReplies() {}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String content;
    private String publicationDate;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comments comments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public CommentsReplies(String content, String publicationDate) {
        this.content = content;
        this.publicationDate = publicationDate;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public void setComments(Comments comments) {
        this.comments = comments;
    }
    public Comments getComments() {
        return comments;
    }

    public Long getId() {
        return id;
    }
    public String getContent() {
        return content;
    }
    public String getPublicationDate() {return publicationDate;}



}
