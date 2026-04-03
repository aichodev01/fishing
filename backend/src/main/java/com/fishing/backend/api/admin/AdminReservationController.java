package com.fishing.backend.api.admin;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishing.backend.api.admin.dto.UpdateReservationStatusRequest;
import com.fishing.backend.domain.Reservation;
import com.fishing.backend.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {
	private static final Set<String> ALLOWED = Set.of("PENDING", "CONFIRMED", "CANCELLED");
	private final ReservationService reservationService;

	@GetMapping
	public List<Reservation> list() {
		return reservationService.listAll();
	}

	@PutMapping("/{id}/status")
	public Reservation updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateReservationStatusRequest req) {
		String status = req.getStatus().toUpperCase(Locale.ROOT);
		if (!ALLOWED.contains(status)) {
			throw new IllegalArgumentException("invalid status");
		}
		return reservationService.adminUpdateStatus(id, status);
	}
}

