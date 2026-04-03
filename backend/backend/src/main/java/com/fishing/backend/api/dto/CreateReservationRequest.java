package com.fishing.backend.api.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CreateReservationRequest {
	@NotNull
	private Long productId;

	@NotNull
	private LocalDate date;

	private LocalTime startTime;

	@NotNull
	@Min(1)
	private Integer people;

	private String memo;
}

