package com.bkap.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bkap.entities.Category;
import com.bkap.entities.Product;
import com.bkap.repositories.CategoryRepository;
import com.bkap.repositories.ProductRepository;



@Service
public class ProductServices {

	@Autowired
	private ProductRepository repo;
	@Autowired
	private CategoryRepository categoryRepository;
	
	public List<Product> getAll(){
		return repo.findAll();
	}
	public List<Product> getTop5(){
		return repo.findTop5ByOrderByProductIdAsc();
	}
	@Transactional
	public void update(Product product) {
		// Lấy Category đã tồn tại từ cơ sở dữ liệu
		Category category = product.getCategory();
		if (category != null && category.getCategoryId() > 0) {
			// Giả sử Category entity có phương thức getCategoryId()
			Category existingCategory = categoryRepository.findById(category.getCategoryId())
					.orElseThrow(() -> new RuntimeException("Không tìm thấy Category với ID: " + category.getCategoryId()));
			
			// Gán category đã tồn tại vào product
			product.setCategory(existingCategory);
		}
		
		// Lưu product với category đã tồn tại
		repo.save(product);
	}
	
	public Optional<Product> getById(String productId) {
		return repo.findById(productId);
	}
	 @Transactional // <-- THÊM HOẶC KIỂM TRA ANNOTATION NÀY
	    public void delete(String productId) {
	        System.out.println("Service: Attempting to delete product ID: " + productId);
	        // ... logic kiểm tra tồn tại và gọi repository.deleteById() ...
	         if (repo.existsById(productId)) {
	        	 repo.deleteById(productId);
	             System.out.println("Service: Deleted product with ID: " + productId); // Log này chỉ nên ở đây nếu xóa thành công
	         } else {
	            System.out.println("Service: Product with ID " + productId + " not found.");
	         }
	    }

	public Category getCategory(String categoryId) {
		return repo.getReferenceById(categoryId).getCategory();
	}
	public List<Product> searchProductsByName(String name){
		return repo.findByNameContain(name);
	}
	public List<Product> getByStatus(boolean status){
		return repo.findByStatus(status);
	}
	
	public List<Product> getByCategory(String categoryId) {
		try {
			Integer categoryIdInt = Integer.parseInt(categoryId);
			return repo.findByCategoryCategoryId(categoryIdInt);
		} catch (NumberFormatException e) {
			throw new IllegalArgumentException("Category ID phải là một số nguyên");
		}
	}
	
}
