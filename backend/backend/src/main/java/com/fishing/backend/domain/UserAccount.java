package com.fishing.backend.domain;

import java.time.Instant;

import lombok.Data;

@Data
public class UserAccount {
	private Long id;
	private String email;
	private String passwordHash;
	private String name;
	private String phone;
	private String role;
	private Instant createdAt;
	private Instant updatedAt;
}

