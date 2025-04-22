package com.example.demo.Service;

import com.example.demo.Repository.ProfileStatisticsRepository;
import com.example.demo.model.ProfileStatistics;
import org.springframework.stereotype.Service;

@Service
public class ProfileStatisticsService {
    private final ProfileStatisticsRepository profileStatisticsRepository;

    public ProfileStatisticsService(ProfileStatisticsRepository profileStatisticsRepository) {
        this.profileStatisticsRepository = profileStatisticsRepository;
    }

    public void save(ProfileStatistics profileStatistics) {
        profileStatisticsRepository.save(profileStatistics);
    }
}
