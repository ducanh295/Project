package com.bkap.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Table(name="products")
@Entity
public class Product {
	@Id
	@NotEmpty(message = "Tên sản phẩm không được để trống")
	@Column(name="productid",length = 10)
	private String productId;
	
	 @NotEmpty(message = "Tên sản phẩm không được để trống")
	@Column(name="productname",length=200)
	private String productName;
	 @NotNull(message = "Giá không được để trống") // Bắt buộc không null
	    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
	 @Column(name="priceold")
	private int priceOld;
	private int price;
	
	@Column(name="colors",length=200)
	private String colors;
	
	@Column(name="sizes",length=200)
	private String sizes;
	
	@Column(name="pictures",length=500)
	private String pictures;
	
	@Column(name="brief",length=1000)
	private String brief;
	
	@Column(name="description",columnDefinition = "nvarchar(max)")
	private String description;
	private boolean status;
		
	@ManyToOne
	@JoinColumn(name = "categoryid",nullable = false)
	private Category category;
	
	@OneToMany(mappedBy = "product")
	private Set<OrderDetail> details=new HashSet<OrderDetail>();
	
	public Set<OrderDetail> getDetails() {
		return details;
	}

	public void setDetails(Set<OrderDetail> details) {
		this.details = details;
	}
	
	public void setCategory(Category category) {
	    this.category = category;
	}
	
	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public int getPriceOld() {
		return priceOld;
	}

	public void setPriceOld(int priceOld) {
		this.priceOld = priceOld;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public String getColors() {
		return colors;
	}

	public void setColors(String colors) {
		this.colors = colors;
	}

	public String getSizes() {
		return sizes;
	}

	public void setSizes(String sizes) {
		this.sizes = sizes;
	}

	public String getPictures() {
		return pictures;
	}

	public void setPictures(String pictures) {
		this.pictures = pictures;
	}

	public String getBrief() {
		return brief;
	}

	public void setBrief(String brief) {
		this.brief = brief;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public Category getCategory() {
		return category;
	}

	public String[] getListPictures()
	{
		if (this.pictures!=null)
				return pictures.split(",");
		else
			return new String[0];
	}
	
}
