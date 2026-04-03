package com.fishing.backend.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fishing.backend.domain.UserAccount;
import com.fishing.backend.mapper.UserAccountMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
	private final UserAccountMapper userAccountMapper;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserAccount u = userAccountMapper
			.findByEmail(username)
			.orElseThrow(() -> new UsernameNotFoundException("user not found"));

		String role = u.getRole() == null ? "USER" : u.getRole();
		return new User(
			u.getEmail(),
			u.getPasswordHash(),
			List.of(new SimpleGrantedAuthority("ROLE_" + role))
		);
	}
}

