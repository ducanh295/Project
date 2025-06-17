package com.bkap.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.FetchType;

@Table(name="categories")
@Entity
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="categoryid")
	private int categoryId;
	@Column(name="categoryname",unique = true, length=100)
	private String categoryName;
	private boolean status;
	
	@ManyToOne
    @JoinColumn(name = "parentid")
    @JsonBackReference
    private Category parent;
	
	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Category> subcategories = new ArrayList<>();
	
	@OneToMany(mappedBy = "category")
	@JsonIgnore
	private Set<Product> products=new HashSet<Product>();
	
	
	
	public Category getParent() {
		return parent;
	}


	public void setParent(Category parent) {
		this.parent = parent;
	}


	public List<Category> getSubcategories() {
		return subcategories;
	}


	public void setSubcategories(List<Category> subcategories) {
		this.subcategories = subcategories;
	}


	public Set<Product> getProducts() {
		return products;
	}

	
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	
}

