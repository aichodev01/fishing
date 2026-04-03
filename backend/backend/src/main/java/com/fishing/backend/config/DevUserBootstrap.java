package com.fishing.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.fishing.backend.mapper.UserAccountMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DevUserBootstrap implements CommandLineRunner {
	private final UserAccountMapper userAccountMapper;
	private final JdbcTemplate jdbcTemplate;

	@Override
	public void run(String... args) {
		// Keep local development users deterministic.
		userAccountMapper.upsertDevUser(
			"user1@example.com",
			"{noop}dev",
			"테스트유저",
			"010-0000-0000",
			"USER"
		);
		userAccountMapper.upsertDevUser(
			"admin@example.com",
			"{noop}dev",
			"관리자",
			"010-9999-9999",
			"ADMIN"
		);

		// Fix mojibake from previous non-UTF8 seed runs for dev records.
		jdbcTemplate.update(
			"""
			INSERT INTO fishing_spot (id, name, address, description)
			VALUES (1, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				name = VALUES(name),
				address = VALUES(address),
				description = VALUES(description)
			""",
			"강변 낚시터",
			"서울 어딘가 123",
			"가족/초보 환영"
		);
		jdbcTemplate.update(
			"""
			INSERT INTO fishing_spot (id, name, address, description)
			VALUES (2, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				name = VALUES(name),
				address = VALUES(address),
				description = VALUES(description)
			""",
			"바다 선상낚시",
			"인천 항구 45",
			"선상 출조 상품"
		);

		jdbcTemplate.update(
			"""
			INSERT INTO fishing_product (id, spot_id, name, description, base_price, max_people, active)
			VALUES (1, 1, ?, ?, 50000, 6, TRUE)
			ON DUPLICATE KEY UPDATE
				name = VALUES(name),
				description = VALUES(description),
				base_price = VALUES(base_price),
				max_people = VALUES(max_people),
				active = VALUES(active)
			""",
			"반일 체험(4시간)",
			"장비 대여 포함"
		);
		jdbcTemplate.update(
			"""
			INSERT INTO fishing_product (id, spot_id, name, description, base_price, max_people, active)
			VALUES (2, 1, ?, ?, 80000, 6, TRUE)
			ON DUPLICATE KEY UPDATE
				name = VALUES(name),
				description = VALUES(description),
				base_price = VALUES(base_price),
				max_people = VALUES(max_people),
				active = VALUES(active)
			""",
			"종일 체험(8시간)",
			"장비 대여 포함"
		);
		jdbcTemplate.update(
			"""
			INSERT INTO fishing_product (id, spot_id, name, description, base_price, max_people, active)
			VALUES (3, 2, ?, ?, 120000, 10, TRUE)
			ON DUPLICATE KEY UPDATE
				name = VALUES(name),
				description = VALUES(description),
				base_price = VALUES(base_price),
				max_people = VALUES(max_people),
				active = VALUES(active)
			""",
			"선상 출조(6시간)",
			"미끼/채비 별도"
		);
	}
}

