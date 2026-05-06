package com.traveltech.core;

import com.traveltech.dto.CityDTO;
import com.traveltech.dto.ItinerarySegmentDTO;
import com.traveltech.shared.OptimizationStrategy;
import com.traveltech.shared.TransportType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ItineraryOptimizationEngine {

    private final GeoService geoService;
    private final Random random = new Random();

    public List<ItinerarySegmentDTO> optimize(CityDTO origin, List<CityDTO> destinations, 
                                              OptimizationStrategy strategy, LocalDate startDate) {
        List<ItinerarySegmentDTO> segments = new ArrayList<>();
        List<CityDTO> remaining = new ArrayList<>(destinations);
        CityDTO current = origin;
        LocalDateTime currentTime = (startDate != null ? startDate.atTime(8, 0) : LocalDateTime.now().plusDays(1).withHour(8).withMinute(0));

        while (!remaining.isEmpty()) {
            CityDTO bestNext = null;
            double bestScore = Double.MAX_VALUE;
            ItinerarySegmentDTO bestSegment = null;

            for (CityDTO next : remaining) {
                ItinerarySegmentDTO segment = calculateSegment(current, next, currentTime);
                double score = calculateScore(segment, strategy);

                if (score < bestScore) {
                    bestScore = score;
                    bestNext = next;
                    bestSegment = segment;
                }
            }

            segments.add(bestSegment);
            remaining.remove(bestNext);
            current = bestNext;
            // Add 4 hours for buffer/meeting between flights
            currentTime = bestSegment.getArrivalTime().plusHours(4);
        }

        return segments;
    }

    private ItinerarySegmentDTO calculateSegment(CityDTO from, CityDTO to, LocalDateTime departure) {
        double distance = geoService.calculateDistance(from.getLatitude(), from.getLongitude(), to.getLatitude(), to.getLongitude());
        
        TransportType type;
        double cost;
        double speed;
        double overhead = 0;

        if (distance < 300) {
            type = TransportType.GROUND;
            cost = 30 + random.nextDouble() * 70;
            speed = 60;
        } else if (distance <= 1500) {
            type = TransportType.SHORT_FLIGHT;
            cost = 120 + random.nextDouble() * 180;
            speed = 800;
            overhead = 3; // 2h airport + 1h boarding
        } else {
            type = TransportType.LONG_FLIGHT;
            cost = 400 + random.nextDouble() * 800;
            speed = 800;
            overhead = 3;
        }

        double travelTime = (distance / speed) + overhead;
        // Timezone adjustment: arrival = departure + travelTime + (toOffset - fromOffset)
        LocalDateTime arrival = departure.plusMinutes((long) (travelTime * 60))
                                         .plusHours(to.getUtcOffset() - from.getUtcOffset());

        return ItinerarySegmentDTO.builder()
                .from(from.getName())
                .to(to.getName())
                .distance(distance)
                .transportType(type)
                .estimatedCost(cost)
                .estimatedTime(travelTime)
                .departureTime(departure)
                .arrivalTime(arrival)
                .build();
    }

    private double calculateScore(ItinerarySegmentDTO segment, OptimizationStrategy strategy) {
        double cost = segment.getEstimatedCost();
        double time = segment.getEstimatedTime();

        return switch (strategy) {
            case MIN_COST -> cost;
            case MIN_TIME -> time * 100; // Scale time to be comparable to cost
            case BALANCED -> (0.6 * cost) + (0.4 * time * 100);
        };
    }
}
