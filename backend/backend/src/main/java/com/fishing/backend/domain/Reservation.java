package com.fishing.backend.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class Reservation {
	private Long id;
	private Long userId;
	private Long productId;
	private LocalDate reservedDate;
	private LocalTime startTime;
	private Integer people;
	private String status;
	private Integer totalPrice;
	private String memo;
	private Instant createdAt;
	private Instant updatedAt;
}

