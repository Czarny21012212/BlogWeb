package com.example.demo.Service;

import com.example.demo.Repository.ProfileRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.model.Profile;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public void save(Profile profile) {
        profileRepository.save(profile);
    }

    public ResponseEntity<Map<String, String>> ChangeUsername(String username, User user) {
        Map<String, String> response = new HashMap<>();

        Optional<Profile> userName =  profileRepository.findByUserName(username);

        if(userName.isEmpty()){
            Profile profile = user.getProfile();
            profile.setUserName(username);
            profileRepository.save(profile);
            userRepository.save(user);
            response.put("message", "success");
            return ResponseEntity.ok(response);
        }else{
            response.put("message", "This username is already taken");
            return ResponseEntity.ok(response);
        }
    }


}
