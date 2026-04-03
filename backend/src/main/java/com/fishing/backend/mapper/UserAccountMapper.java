package com.fishing.backend.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.fishing.backend.domain.UserAccount;

@Mapper
public interface UserAccountMapper {
	Optional<UserAccount> findByEmail(@Param("email") String email);
	Optional<UserAccount> findById(@Param("id") Long id);
	int upsertDevUser(
		@Param("email") String email,
		@Param("passwordHash") String passwordHash,
		@Param("name") String name,
		@Param("phone") String phone,
		@Param("role") String role
	);
}

