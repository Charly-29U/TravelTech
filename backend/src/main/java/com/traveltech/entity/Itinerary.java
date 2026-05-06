package com.traveltech.entity;

import com.traveltech.shared.OptimizationStrategy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "itineraries")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Itinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origin;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Object destinations; // List of city names

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(nullable = false)
    private int passengers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OptimizationStrategy strategy;

    @Column(nullable = false)
    private double budget;

    @Column(name = "total_cost")
    private double totalCost;

    @Column(name = "total_time")
    private double totalTime;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object result; // The list of segments

    @Column(nullable = false)
    private String status; // OPTIMAL, OVER_BUDGET

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
