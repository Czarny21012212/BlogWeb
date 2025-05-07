package com.example.demo.Service;

import com.example.demo.Repository.UserRepository;
import com.example.demo.model.Profile;
import com.example.demo.model.ProfileStatistics;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final ProfileStatisticsService profileStatisticsService;

    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, ProfileService profileService, ProfileStatisticsService profileStatisticsService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.profileService = profileService;
        this.profileStatisticsService = profileStatisticsService;
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
}
