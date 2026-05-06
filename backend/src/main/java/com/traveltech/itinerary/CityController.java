package com.traveltech.itinerary;

import com.traveltech.dto.ApiResponse;
import com.traveltech.entity.City;
import com.traveltech.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityRepository cityRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<City>>> getAllCities() {
        return ResponseEntity.ok(ApiResponse.<List<City>>builder()
                .success(true)
                .data(cityRepository.findAll())
                .build());
    }
}
