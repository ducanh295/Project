package com.bkap.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bkap.entities.ERole;
import com.bkap.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	Role findByRoleName(ERole roleName);
}