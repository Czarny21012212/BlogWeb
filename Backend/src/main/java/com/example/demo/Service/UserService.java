package com.example.demo.Service;

import com.example.demo.Repository.CommentsRepliesRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.model.Profile;
import com.example.demo.model.ProfileStatistics;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.model.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final ProfileStatisticsService profileStatisticsService;

    private final CommentsRepliesRepository commentsRepliesRepository;

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, ProfileService profileService, ProfileStatisticsService profileStatisticsService, CommentsRepliesRepository commentsRepliesRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.profileService = profileService;
        this.profileStatisticsService = profileStatisticsService;
        this.commentsRepliesRepository = commentsRepliesRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void save(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void createUserWithProfile(User user, Profile profile) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        profile.setUser(user);
        profileService.save(profile);

        ProfileStatistics profileStatistics = new ProfileStatistics();
        profileStatistics.setProfile(profile);
        profileStatisticsService.save(profileStatistics);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findAll(int limit, int offset) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        return userRepository.findAll(pageable).getContent();
    }
}
