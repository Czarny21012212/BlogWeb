package com.example.demo.Service;

import com.example.demo.Repository.ProfileRepository;
import com.example.demo.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public void save(Profile profile) {
        profileRepository.save(profile);
    }


}
