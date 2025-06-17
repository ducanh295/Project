package com.bkap.models;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AccountModel {
	
	private String accountId;
	
	@NotBlank(message = "Không để trống")
	@Size(min = 3, max = 50, message = "Độ dài không hợp lệ 5-50")
	private String username;
	@NotBlank(message = "Không để trống")
	@Size(min = 3, max = 50, message = "Độ dài không hợp lệ 5-50")
	private String password;
	@NotBlank(message = "Không để trống")
	@Size(min = 3, max = 50, message = "Độ dài không hợp lệ 5-50")
	private String confirmpassword;
	@NotBlank(message = "Không để trống")
	@Email(message = "Email không hợp lệ")
	private String email;
	
	@NotBlank(message = "Không để trống")
	private String fullname;
	
	@NotBlank(message = "Không để trống")
	private String address;
	
	@NotBlank(message = "Không để trống")
	private String phone;
	
	private String picture;
	
	private String dateOfBirth;
	private String gender;
	private String nationality;
	private String hobbies;
	private String bio;
	
	public AccountModel() {
		// TODO Auto-generated constructor stub
	}
	
	
	public AccountModel(String accountId, String username, String password, String confirmpassword, String email,
			String fullname, String address, String phone, String picture, String dateOfBirth, String gender, String nationality, String hobbies, String bio) {
		super();
		this.accountId = accountId;
		this.username = username;
		this.password = password;
		this.confirmpassword = confirmpassword;
		this.email = email;
		this.fullname = fullname;
		this.address = address;
		this.phone = phone;
		this.picture = picture;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.nationality = nationality;
		this.hobbies = hobbies;
		this.bio = bio;
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
	public String getConfirmpassword() {
		return confirmpassword;
	}
	public void setConfirmpassword(String confirmpassword) {
		this.confirmpassword = confirmpassword;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
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
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	
	public void setAvatar(String avatar) {
		this.picture = avatar;
	}
	
	public String getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(String dateOfBirth) {
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
}