package com.traveltech.dto;

import lombok.Data;

@Data
public class DestinationRequest {
    private String city;
    private int stayDays;
    private String transportType;
}
