package com.fishing.backend.api;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishing.backend.mapper.UserAccountMapper;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final UserAccountMapper userAccountMapper;

	@GetMapping("/me")
	public Map<String, Object> me(Authentication auth) {
		return userAccountMapper
			.findByEmail(auth.getName())
			.<Map<String, Object>>map(u -> Map.of(
				"id", u.getId(),
				"email", u.getEmail(),
				"name", u.getName(),
				"role", u.getRole()
			))
			.orElse(Map.of(
				"email", auth.getName()
			));
	}

	@PostMapping("/login")
	public void login(
		HttpServletRequest request,
		HttpServletResponse response,
		@Valid @RequestBody LoginRequest body
	) {
		Authentication auth = authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword())
		);

		var context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(auth);
		SecurityContextHolder.setContext(context);
		new HttpSessionSecurityContextRepository().saveContext(context, request, response);
	}

	@PostMapping("/logout")
	public void logout(HttpServletRequest request) {
		var session = request.getSession(false);
		if (session != null) session.invalidate();
		SecurityContextHolder.clearContext();
	}

	@Data
	public static class LoginRequest {
		@NotBlank
		private String email;

		@NotBlank
		private String password;
	}
}

