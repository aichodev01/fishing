package com.fishing.backend.domain;

import java.time.Instant;

import lombok.Data;

@Data
public class FishingProduct {
	private Long id;
	private Long spotId;
	private String name;
	private String description;
	private Integer basePrice;
	private Integer maxPeople;
	private Boolean active;
	private Instant createdAt;
	private Instant updatedAt;
}

