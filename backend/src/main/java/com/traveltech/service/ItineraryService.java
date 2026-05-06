package com.traveltech.service;

import com.traveltech.core.ItineraryOptimizationEngine;
import com.traveltech.dto.CityDTO;
import com.traveltech.dto.ItinerarySegmentDTO;
import com.traveltech.entity.City;
import com.traveltech.entity.Itinerary;
import com.traveltech.entity.User;
import com.traveltech.exception.ResourceNotFoundException;
import com.traveltech.repository.CityRepository;
import com.traveltech.repository.ItineraryRepository;
import com.traveltech.shared.OptimizationStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final CityRepository cityRepository;
    private final ItineraryOptimizationEngine optimizationEngine;

    @Transactional
    public Itinerary createItinerary(String originName, List<String> destinationNames, 
                                     double budget, OptimizationStrategy strategy, LocalDate startDate, User user) {
        
        City origin = cityRepository.findByName(originName)
                .orElseThrow(() -> new ResourceNotFoundException("Origin city not found: " + originName));

        List<City> destinations = destinationNames.stream()
                .map(name -> cityRepository.findByName(name)
                        .orElseThrow(() -> new ResourceNotFoundException("Destination city not found: " + name)))
                .collect(Collectors.toList());

        CityDTO originDTO = mapToDTO(origin);
        List<CityDTO> destinationDTOs = destinations.stream().map(this::mapToDTO).toList();

        List<ItinerarySegmentDTO> resultSegments = optimizationEngine.optimize(originDTO, destinationDTOs, strategy, startDate);

        double totalCost = resultSegments.stream().mapToDouble(ItinerarySegmentDTO::getEstimatedCost).sum();
        double totalTime = resultSegments.stream().mapToDouble(ItinerarySegmentDTO::getEstimatedTime).sum();
        String status = totalCost <= budget ? "OPTIMAL" : "OVER_BUDGET";

        Itinerary itinerary = Itinerary.builder()
                .origin(originName)
                .destinations(destinationNames)
                .strategy(strategy)
                .startDate(startDate)
                .budget(budget)
                .totalCost(totalCost)
                .totalTime(totalTime)
                .result(resultSegments)
                .status(status)
                .user(user)
                .build();

        return itineraryRepository.save(itinerary);
    }

    public List<Itinerary> getUserItineraries(User user) {
        return itineraryRepository.findByUser(user);
    }

    public Itinerary getItinerary(Long id) {
        return itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));
    }

    @Transactional
    public void deleteItinerary(Long id) {
        itineraryRepository.deleteById(id);
    }

    private CityDTO mapToDTO(City city) {
        return CityDTO.builder()
                .name(city.getName())
                .country(city.getCountry())
                .latitude(city.getLatitude())
                .longitude(city.getLongitude())
                .utcOffset(city.getUtcOffset())
                .build();
    }
}
