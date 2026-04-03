package com.fishing.backend.api;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fishing.backend.service.ConflictException;
import com.fishing.backend.service.NotFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<Map<String, Object>> notFound(NotFoundException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
			"message", e.getMessage()
		));
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<Map<String, Object>> conflict(ConflictException e) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
			"message", e.getMessage()
		));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> badRequest(IllegalArgumentException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
			"message", e.getMessage()
		));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
			"message", "validation failed",
			"errors", e.getBindingResult().getFieldErrors().stream().map(err -> Map.of(
				"field", err.getField(),
				"message", err.getDefaultMessage()
			)).toList()
		));
	}
}

