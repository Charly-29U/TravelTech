package com.traveltech.itinerary;

import com.traveltech.dto.ApiResponse;
import com.traveltech.dto.ItineraryRequest;
import com.traveltech.entity.Itinerary;
import com.traveltech.entity.User;
import com.traveltech.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Itinerary>> createItinerary(
            @RequestBody ItineraryRequest request,
            @AuthenticationPrincipal User user
    ) {
        java.util.List<String> destinationNames = request.getDestinations().stream()
                .map(com.traveltech.dto.DestinationRequest::getCity)
                .toList();

        Itinerary itinerary = itineraryService.createItinerary(
                request.getOrigin(),
                destinationNames,
                request.getBudget(),
                request.getStrategy(),
                request.getStartDate(),
                user
        );
        return ResponseEntity.ok(ApiResponse.<Itinerary>builder()
                .success(true)
                .data(itinerary)
                .message("Itinerary optimized and created successfully")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Itinerary>>> getMyItineraries(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.<List<Itinerary>>builder()
                .success(true)
                .data(itineraryService.getUserItineraries(user))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Itinerary>> getItinerary(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<Itinerary>builder()
                .success(true)
                .data(itineraryService.getItinerary(id))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItinerary(@PathVariable Long id) {
        itineraryService.deleteItinerary(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Itinerary deleted")
                .build());
    }
}
