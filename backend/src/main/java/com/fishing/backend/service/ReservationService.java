package com.fishing.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fishing.backend.domain.FishingProduct;
import com.fishing.backend.domain.Reservation;
import com.fishing.backend.mapper.ReservationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {
	private final ProductService productService;
	private final ReservationMapper reservationMapper;

	public boolean isAvailable(Long productId, LocalDate date, LocalTime startTime) {
		productService.getProduct(productId); // validate exists
		return !reservationMapper.existsForSlot(productId, date, startTime);
	}

	@Transactional
	public Reservation createReservation(
		Long userId,
		Long productId,
		LocalDate date,
		LocalTime startTime,
		int people,
		String memo
	) {
		if (people <= 0) {
			throw new IllegalArgumentException("people must be >= 1");
		}

		FishingProduct product = productService.getProduct(productId);
		if (Boolean.FALSE.equals(product.getActive())) {
			throw new ConflictException("product is inactive");
		}
		if (product.getMaxPeople() != null && people > product.getMaxPeople()) {
			throw new ConflictException("people exceeds maxPeople");
		}

		boolean available = isAvailable(productId, date, startTime);
		if (!available) {
			throw new ConflictException("slot is not available");
		}

		int totalPrice = safeMultiply(product.getBasePrice(), people);

		Reservation reservation = new Reservation();
		reservation.setUserId(userId);
		reservation.setProductId(productId);
		reservation.setReservedDate(date);
		reservation.setStartTime(startTime);
		reservation.setPeople(people);
		reservation.setStatus("PENDING");
		reservation.setTotalPrice(totalPrice);
		reservation.setMemo(memo);

		reservationMapper.insert(reservation);
		return reservationMapper
			.findById(Objects.requireNonNull(reservation.getId()))
			.orElseThrow(() -> new IllegalStateException("created reservation not found"));
	}

	@Transactional
	public void cancel(Long reservationId) {
		reservationMapper
			.findById(reservationId)
			.orElseThrow(() -> new NotFoundException("reservation not found"));

		int updated = reservationMapper.cancelById(reservationId);
		if (updated == 0) {
			throw new ConflictException("reservation cannot be cancelled");
		}
	}

	public List<Reservation> listAll() {
		return reservationMapper.findAll();
	}

	@Transactional
	public Reservation adminUpdateStatus(Long reservationId, String status) {
		reservationMapper
			.findById(reservationId)
			.orElseThrow(() -> new NotFoundException("reservation not found"));
		reservationMapper.updateStatus(reservationId, status);
		return reservationMapper
			.findById(reservationId)
			.orElseThrow(() -> new NotFoundException("reservation not found"));
	}

	private static int safeMultiply(Integer basePrice, int people) {
		int price = basePrice == null ? 0 : basePrice;
		return Math.multiplyExact(price, people);
	}
}

