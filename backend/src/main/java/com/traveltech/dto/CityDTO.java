package com.traveltech.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CityDTO {
    private String name;
    private String country;
    private double latitude;
    private double longitude;
    private int utcOffset;
}
