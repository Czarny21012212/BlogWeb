package com.example.demo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Comments {
    public Comments() {}
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String content;
    private String publicationDate;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @OneToMany(mappedBy = "comments", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentsReplies> commentsReplies;

    public Comments(String content, String publicationDate) {
        this.content = content;
        this.publicationDate = publicationDate;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public void setPublicationDate(String publicationDate) {
        this.publicationDate = publicationDate;
    }
    public String getPublicationDate(){
        return publicationDate;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public Post getPost() {
        return post;
    }
    public void setPost(Post post) {
        this.post = post;
    }

    public List<CommentsReplies> getCommentsReplies() {return commentsReplies;}
    public void setCommentsReplies(List<CommentsReplies> commentsReplies) {}


}
