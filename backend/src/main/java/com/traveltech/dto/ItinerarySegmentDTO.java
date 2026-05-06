package com.traveltech.dto;

import com.traveltech.shared.TransportType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ItinerarySegmentDTO {
    private String from;
    private String to;
    private double distance;
    private TransportType transportType;
    private double estimatedCost;
    private double estimatedTime; // in hours
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
}
