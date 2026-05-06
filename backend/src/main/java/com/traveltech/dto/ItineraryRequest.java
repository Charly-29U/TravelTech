package com.traveltech.dto;

import com.traveltech.shared.OptimizationStrategy;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ItineraryRequest {
    private String origin;
    private List<DestinationRequest> destinations;
    private double budget;
    private LocalDate startDate;
    private LocalDate returnDate;
    private int passengers;
    private OptimizationStrategy strategy;
}
