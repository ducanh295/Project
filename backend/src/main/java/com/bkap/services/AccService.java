package com.bkap.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bkap.entities.Account;
import com.bkap.repositories.AccountRepository;

@Service
public class AccService {
	@Autowired
	private AccountRepository repository;
	
	public List<Account> getAll(){
		return repository.findAll();
	}
	
	public Page<Account> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}
	
	public Page<Account> search(String keyword, Pageable pageable) {
		return repository.findByUsernameContainingOrEmailContainingOrFullnameContaining(keyword, keyword, keyword, pageable);
	}
	
	public Page<Account> findByStatus(boolean status, Pageable pageable) {
		return repository.findByEnabled(status, pageable);
	}
	
	public Optional<Account> getById(String accountId) {
		return repository.findById(accountId);
	}
	
	public Account save(Account account) {
		return repository.save(account);
	}
	
	public void delete(String accountId) {
		repository.deleteById(accountId);
	}
	
	public boolean existsByUsername(String username) {
		return repository.existsByUsername(username);
	}
	
	public boolean existsByEmail(String email) {
		return repository.existsByEmail(email);
	}
}

