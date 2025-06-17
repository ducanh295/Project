package com.bkap.repositories;

import java.util.Optional;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bkap.entities.Account;


@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
	Optional<Account> findByUsernameIgnoreCase(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);
	
	Optional<Account> findByEmailIgnoreCase(String email);
	
	Page<Account> findByUsernameContainingOrEmailContainingOrFullnameContaining(
		String username, String email, String fullname, Pageable pageable);
	Page<Account> findByEnabled(boolean enabled, Pageable pageable);
}