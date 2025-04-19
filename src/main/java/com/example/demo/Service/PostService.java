package com.example.demo.Service;

import com.example.demo.Repository.PostRepository;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void save(Post post) {
        postRepository.save(post);
    }

    public List<Post> findMyPost(Long userId) {
        return postRepository.findAllByUserId(userId);
    }

    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

}
