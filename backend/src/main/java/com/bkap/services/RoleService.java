package com.bkap.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bkap.entities.ERole;
import com.bkap.entities.Role;
import com.bkap.repositories.RoleRepository;

@Service
public class RoleService {
	@Autowired 
	RoleRepository roleRepository;
	public Role getByRole(ERole role) {
		return roleRepository.findByRoleName(role);
	}
	
	public Role findByName(ERole roleName) {
		return roleRepository.findByRoleName(roleName);
	}
}
	