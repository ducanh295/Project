package com.bkap.entities;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="orders")
public class Order {
	@Id
	@Column(name="orderid", length = 12)
	private String orderId;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Column(name="orderdate")
	private Date orderDate=new Date();
	
	@Column(name="receivename", length = 100)
	private String receiveName;
	
	@Column(name="receiveaddress", length = 100)
	private String receiveAddress;
	
	@Column(name="receivephone", length = 100)
	private String receivePhone;
	
	private OrderStatus status;
	
	@Column(name="note",length = 1000)
	private String note;
	
	@ManyToOne
	@JoinColumn(name = "accountid",nullable = false)
	private Account account=new Account();
	
	@OneToMany(mappedBy = "order")
	private Set<OrderDetail> details=new HashSet<OrderDetail>();

	public String getOrderId() {
		return orderId;
	}
	

	public Set<OrderDetail> getDetails() {
		return details;
	}


	public void setDetails(Set<OrderDetail> details) {
		this.details = details;
	}


	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	

	public String getReceiveName() {
		return receiveName;
	}

	public void setReceiveName(String receiveName) {
		this.receiveName = receiveName;
	}

	public String getReceiveAddress() {
		return receiveAddress;
	}

	public void setReceiveAddress(String receiveAddress) {
		this.receiveAddress = receiveAddress;
	}

	public String getReceivePhone() {
		return receivePhone;
	}

	public void setReceivePhone(String receivePhone) {
		this.receivePhone = receivePhone;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}


	public String getNote() {
		return note;
	}


	public void setNote(String note) {
		this.note = note;
	}
	
	
}