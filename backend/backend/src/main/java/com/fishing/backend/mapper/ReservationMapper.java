package com.fishing.backend.mapper;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.fishing.backend.domain.Reservation;

@Mapper
public interface ReservationMapper {
	boolean existsForSlot(
		@Param("productId") Long productId,
		@Param("reservedDate") LocalDate reservedDate,
		@Param("startTime") LocalTime startTime
	);

	int insert(Reservation reservation);

	Optional<Reservation> findById(Long id);

	int cancelById(@Param("id") Long id);

	List<Reservation> findAll();

	int updateStatus(@Param("id") Long id, @Param("status") String status);
}

