package com.example.demo.Repository;

import com.example.demo.model.ProfileStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileStatisticsRepository extends JpaRepository<ProfileStatistics, Long> {
}
