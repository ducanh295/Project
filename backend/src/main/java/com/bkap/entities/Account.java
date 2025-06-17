package com.bkap.entities;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.bkap.models.AccountModel;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "accounts")
public class Account {
	@Id
	@Column(name = "accountid", length = 36)
	private String accountId;

	@NotBlank
	@Size(max = 64)
	@Column(name = "username", length = 64, unique = true)
	private String username;

	@NotBlank
	@Column(name = "password", length = 256)
	private String password;

	@Email
	@Column(name = "email", length = 64, unique = true)
	private String email;

	@Column(name = "phone", length = 64)
	private String phone;

	@Column(name = "fullname", columnDefinition = "nvarchar(100)")
	private String fullname;

	@Column(name = "address", columnDefinition = "nvarchar(256)")
	private String address;
	
	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;


	@Column(name = "hobbies", columnDefinition = "nvarchar(255)")
	private String hobbies;

	@Column(name = "nationality", columnDefinition = "nvarchar(255)")
	private String nationality;

	@Column(name = "bio", columnDefinition = "nvarchar(255)")
	private String bio;

	@Column(name = "gender", columnDefinition = "nvarchar(255)")
	private String gender;

	@Column(name = "picture", length = 512)
	private String picture;

	@Column(name = "enabled")
	private boolean enabled;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "accountroles", joinColumns = @JoinColumn(name = "accountid",columnDefinition = "nvarchar(36)"), inverseJoinColumns = @JoinColumn(name = "roleid"))
	private Set<Role> roles = new HashSet<>();

	 @OneToMany(mappedBy = "account")
		private Set<Order> orders=new HashSet<Order>();
		

		public Set<Order> getOrders() {
			return orders;
		}

		public void setOrders(Set<Order> orders) {
			this.orders = orders;
		}
	
	public Account() {

	}

	public Account(AccountModel accountModel, Role role) {
		this.accountId=UUID.randomUUID().toString().toUpperCase();
		this.username=accountModel.getUsername();
		this.password=new BCryptPasswordEncoder().encode(accountModel.getPassword());
		this.fullname=accountModel.getFullname();
		this.address=accountModel.getAddress();
		this.phone=accountModel.getPhone();
		this.picture=accountModel.getPicture();
		this.enabled=true;
		this.email=accountModel.getEmail();
		this.dateOfBirth = accountModel.getDateOfBirth() != null && !accountModel.getDateOfBirth().isEmpty()
			? LocalDate.parse(accountModel.getDateOfBirth()) : null;
		this.gender = accountModel.getGender();
		this.nationality = accountModel.getNationality();
		this.hobbies = accountModel.getHobbies();
		this.bio = accountModel.getBio();
		var roles=new HashSet<Role>();
		roles.add(role);
		this.setRoles(roles);
	}

	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
	
	

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getHobbies() {
		return hobbies;
	}

	public void setHobbies(String hobbies) {
		this.hobbies = hobbies;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public Long getId() {
		// TODO Auto-generated method stub
		return null;
	}

}