package com.fishing.backend.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class AvailabilityResponse {
	private Long productId;
	private LocalDate date;
	private LocalTime startTime;
	private boolean available;
}

