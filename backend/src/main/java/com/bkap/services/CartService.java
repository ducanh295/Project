package com.bkap.services;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bkap.entities.Account;
import com.bkap.entities.AccountDetails;
import com.bkap.entities.Cart;
import com.bkap.entities.CartItem;
import com.bkap.entities.Order;
import com.bkap.entities.OrderDetail;
import com.bkap.entities.OrderStatus;
import com.bkap.entities.Product;
import com.bkap.models.Item;
import com.bkap.repositories.AccountRepository;
import com.bkap.repositories.CartRepository;
import com.bkap.repositories.OrderDetailRepository;
import com.bkap.repositories.OrderRepository;
import com.bkap.repositories.ProductRepository;

@Service
public class CartService {
	
	@Autowired
	OrderRepository orderRepository;
	
	@Autowired
	OrderDetailRepository detailRepository;
	
	@Autowired
	AccountRepository accountRepository;
	
	@Autowired
	ProductRepository productRepository;
	
	@Autowired
	private CartRepository cartRepository;
	
	@Autowired
	private ProductServices productService;
	
	public List<Item> addCart(Product product, List<Item> items) {
		var find = false;
		for (Item item : items) {
			if (item.getProductId().equals(product.getProductId())) {
				item.setQuantity(item.getQuantity() + 1);
				item.setTotal(item.getPrice() * item.getQuantity());
				find = true;
				break;
			}
		}
		if (!find) {
			items.add(new Item(product));
		}
		return items;
	}

	public List<Item> removeCart(String productId, List<Item> items) {
		Iterator<Item> temp=items.iterator();
		while(temp.hasNext()) {
			var item=temp.next();
			if (item.getProductId().equals(productId)) {
				items.remove(item);
				break;
			}
		}
		return items;
	}
	public List<Item> updateCart(String[] pids, int[] qtys, List<Item> items){
		for (Item item : items) {
			for (var i=0;i<pids.length;i++) {
				if(item.getProductId().equals(pids[i])) {
					item.setQuantity(qtys[i]);
					item.setTotal(item.getPrice() * item.getQuantity());
				}
			}
		}
		return items;
	}
	
	@Transactional
	public String insertOrder(Order order, List<Item> items)
	{
		String orderId="HD"+(new SimpleDateFormat("ddMMyyhhmm").format(new Date()));
		order.setOrderId(orderId);
		order.setStatus(OrderStatus.ORDER_NEW);
		AccountDetails user = (AccountDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Account acc=accountRepository.findByUsernameIgnoreCase(user.getUsername()).get();
		order.setAccount(acc);
		orderRepository.save(order);
		for (Item item : items) {
			OrderDetail detail=new OrderDetail(item.getPrice(), item.getQuantity(), productRepository.findById(item.getProductId()).get(), order);
			detailRepository.save(detail);
		}
		return "Đặt hàng thành công";
	}
	
	public Cart getOrCreateCart(String accountId) {
		return cartRepository.findByAccountId(accountId)
				.orElseGet(() -> {
					Account account = accountRepository.findById(accountId)
							.orElseThrow(() -> new RuntimeException("Account not found"));
					return cartRepository.save(new Cart(account));
				});
	}

	@Transactional
	public Cart addToCart(String accountId, String productId, int quantity) {
		Cart cart = getOrCreateCart(accountId);
		Product product = productService.getById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		Optional<CartItem> existingItem = cart.getItems().stream()
				.filter(item -> item.getProduct().getProductId().equals(productId))
				.findFirst();

		if (existingItem.isPresent()) {
			existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
		} else {
			cart.addItem(new CartItem(product, quantity));
		}

		return cartRepository.save(cart);
	}

	@Transactional
	public Cart removeFromCart(String accountId, String productId) {
		Cart cart = getOrCreateCart(accountId);
		cart.getItems().removeIf(item -> item.getProduct().getProductId().equals(productId));
		return cartRepository.save(cart);
	}

	@Transactional
	public Cart updateCart(String accountId, String productId, int quantity) {
		Cart cart = getOrCreateCart(accountId);
		cart.getItems().stream()
				.filter(item -> item.getProduct().getProductId().equals(productId))
				.findFirst()
				.ifPresent(item -> item.setQuantity(quantity));
		return cartRepository.save(cart);
	}

	@Transactional
	public Cart clearCart(String accountId) {
		Cart cart = getOrCreateCart(accountId);
		cart.clear();
		return cartRepository.save(cart);
	}

	public List<CartItem> getCartItems(String accountId) {
		return getOrCreateCart(accountId).getItems();
	}
}