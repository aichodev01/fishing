package com.fishing.backend.api;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fishing.backend.api.dto.AvailabilityResponse;
import com.fishing.backend.api.dto.CreateReservationRequest;
import com.fishing.backend.domain.Reservation;
import com.fishing.backend.service.ReservationService;

import org.springframework.security.core.Authentication;
import com.fishing.backend.mapper.UserAccountMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservationController {
	private final ReservationService reservationService;
	private final UserAccountMapper userAccountMapper;

	@GetMapping("/products/{productId}/availability")
	public AvailabilityResponse availability(
		@PathVariable Long productId,
		@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime
	) {
		boolean available = reservationService.isAvailable(productId, date, startTime);
		AvailabilityResponse res = new AvailabilityResponse();
		res.setProductId(productId);
		res.setDate(date);
		res.setStartTime(startTime);
		res.setAvailable(available);
		return res;
	}

	@PostMapping("/reservations")
	public Reservation create(Authentication auth, @Valid @RequestBody CreateReservationRequest req) {
		Long userId = userAccountMapper
			.findByEmail(auth.getName())
			.map(u -> u.getId())
			.orElseThrow(() -> new IllegalStateException("user not found"));

		return reservationService.createReservation(
			userId,
			req.getProductId(),
			req.getDate(),
			req.getStartTime(),
			req.getPeople(),
			req.getMemo()
		);
	}

	@PostMapping("/reservations/{id}/cancel")
	public void cancel(@PathVariable Long id) {
		reservationService.cancel(id);
	}
}

