package com.fishing.backend.api.admin.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UpdateReservationStatusRequest {
	@NotBlank
	private String status;
}

