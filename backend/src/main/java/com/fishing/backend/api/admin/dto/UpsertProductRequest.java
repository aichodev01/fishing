package com.fishing.backend.api.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class UpsertProductRequest {
	@NotNull
	private Long spotId;

	@NotBlank
	private String name;

	private String description;

	@NotNull
	@Min(0)
	private Integer basePrice;

	@NotNull
	@Min(1)
	private Integer maxPeople;

	@NotNull
	private Boolean active;
}

