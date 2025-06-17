package com.bkap.services;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bkap.entities.Account;
import com.bkap.entities.AccountDetails;
import com.bkap.entities.ERole;
import com.bkap.entities.Role;
import com.bkap.repositories.AccountRepository;



@Service
public class AccDetailServices implements UserDetailsService {
    @Autowired
    AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Account> user = accountRepository.findByUsernameIgnoreCase(username);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        Account acc=user.get();

        //xử lý lấy roles của người dùng đưa vào GrantedAuthority
        Collection<GrantedAuthority> grantedAuthoritySet = new HashSet<>();
        Set<Role> roles = acc.getRoles();
        for (Role userRole : roles) {
        	ERole rolename=userRole.getRoleName();
        	grantedAuthoritySet.add(new SimpleGrantedAuthority(rolename.name()));
		}
        //trả về đối tượng AccountDetails
        AccountDetails details = new AccountDetails(acc.getAccountId(), grantedAuthoritySet, acc.getEmail(), acc.getFullname(), acc.getPassword(), acc.getUsername(), acc.getPicture(),acc.getPhone(),acc.getAddress(),  acc.isEnabled(),true,true,true);
        details.setDateOfBirth(acc.getDateOfBirth() != null ? acc.getDateOfBirth().toString() : null);
        details.setGender(acc.getGender());
        details.setNationality(acc.getNationality());
        details.setHobbies(acc.getHobbies());
        details.setBio(acc.getBio());
        return details;
    }

    public Account insert(Account account) {
    	return accountRepository.save(account);
    }

    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsernameIgnoreCase(username);
    }

    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmailIgnoreCase(email);
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }
}