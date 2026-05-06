package com.traveltech.repository;

import com.traveltech.entity.Itinerary;
import com.traveltech.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByUser(User user);
}
