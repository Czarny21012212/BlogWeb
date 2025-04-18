package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "likesT")
public class Like {
    public Like(){}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int likes;

    @OneToOne(mappedBy = "like")
    private Post post;

    public Like(int likes){
        this.likes = likes;
    }

    public Post getPost() {
        return post;
    }
    public void setPost(Post post) {
        this.post = post;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }


    public int getLikes() {
        return likes;
    }
    public void setLikes(int likes) {
        this.likes = likes;
    }
}
