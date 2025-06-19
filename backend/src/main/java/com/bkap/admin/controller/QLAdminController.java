package com.bkap.admin.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bkap.entities.Account;
import com.bkap.entities.Category;
import com.bkap.entities.Product;
import com.bkap.repositories.CategoryRepository;
import com.bkap.services.AccService;
import com.bkap.services.CategoryServices;
import com.bkap.services.ProductServices;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class QLAdminController {

    private final CategoryRepository categoryRepository;
	@Autowired
	ProductServices productService;
	@Autowired // Inject CategoryService
    CategoryServices categoryService;
	@Autowired 
	AccService accService;

    QLAdminController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
	
//	product
	@GetMapping("/admin/products")
	public List<Product> getAllProducts() {
		return productService.getAll();
	}
	
	@GetMapping("/admin/products/search")
	public ResponseEntity<?> searchProducts(@RequestParam(required = false) String searchname, @RequestParam(required = false) Integer status) {
		List<Product> products;
		if (searchname == null || searchname.isEmpty()) {
			products = productService.getByStatus(status == 1);
		} else {
			products = productService.searchProductsByName(searchname);
		}
		return ResponseEntity.ok(products);
	}
	
	@PostMapping("/admin/products")
	public ResponseEntity<?> createProduct(@Valid @ModelAttribute Product product, @RequestParam(required = false) MultipartFile file) {
		try {
			if (file != null && !file.isEmpty()) {
				File imageFolder = new File(new ClassPathResource(".").getFile() + "/static/assets/images");
				if (!imageFolder.exists())
					imageFolder.mkdir();
				Path path = Paths.get(imageFolder.getAbsolutePath(), file.getOriginalFilename());
				file.transferTo(path);
				product.setPictures("/assets/images/" + file.getOriginalFilename());
			}
			productService.update(product);
			return ResponseEntity.ok(product);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error creating product: " + e.getMessage());
		}
	}
	
	@DeleteMapping("/admin/products/{productId}")
	public ResponseEntity<?> deleteProduct(@PathVariable String productId) {
		try {
			productService.delete(productId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error deleting product: " + e.getMessage());
		}
	}

	@GetMapping("/admin/products/{productId}")
	public ResponseEntity<?> getProductDetail(@PathVariable String productId) {
		Optional<Product> productOptional = productService.getById(productId);
		return productOptional.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/admin/products/{productId}")
	public ResponseEntity<?> updateProduct(
		@PathVariable String productId,
		@Valid @ModelAttribute Product product,
		@RequestParam(required = false) MultipartFile file,
		@RequestParam(required = false) Integer categoryId
	) {
		try {
			if (categoryId != null) {
				Category category = categoryService.getById(categoryId).orElse(null);
				product.setCategory(category);
			}

			Product oldProduct = productService.getById(productId).orElse(null);
			if (file != null && !file.isEmpty()) {
				File imageFolder = new File(new ClassPathResource(".").getFile() + "/static/assets/images");
				if (!imageFolder.exists())
					imageFolder.mkdir();
				Path path = Paths.get(imageFolder.getAbsolutePath(), file.getOriginalFilename());
				file.transferTo(path);
				product.setPictures("/assets/images/" + file.getOriginalFilename());
			} else if (oldProduct != null) {
				product.setPictures(oldProduct.getPictures());
			}

			productService.update(product);
			return ResponseEntity.ok(product);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error updating product: " + e.getMessage());
		}
	}
	
//	Category
	@GetMapping("/admin/categories")
	public List<Category> getAllCategories() {
		return categoryService.getAll();
	}
	
	@GetMapping("/admin/categories/search")
	public ResponseEntity<?> searchCategories(@RequestParam(required = false) String searchname, @RequestParam(required = false) Integer status) {
		List<Category> categories;
		if (searchname == null || searchname.isEmpty()) {
			categories = categoryService.getByStatus(status == 1);
		} else {
			categories = categoryService.searchName(searchname);
		}
		return ResponseEntity.ok(categories);
	}
	
	@PostMapping("/admin/categories")
	public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> body) {
		try {
			String categoryName = (String) body.get("categoryName");
			Boolean status = (Boolean) body.get("status");
			Integer parentId = body.get("parentId") != null ? Integer.parseInt(body.get("parentId").toString()) : null;
			Category category = new Category();
			category.setCategoryName(categoryName);
			category.setStatus(status != null ? status : false);
			if (parentId != null) {
				Category parent = categoryRepository.findById(parentId)
						.orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
				category.setParent(parent);
			} else {
				category.setParent(null);
			}
			System.out.println("[CREATE] categoryName=" + categoryName + ", parentId=" + parentId + ", status=" + status);
			System.out.println("[CREATE] category.getParent()=" + (category.getParent() != null ? category.getParent().getCategoryId() : null));
			categoryService.update(category);
			return ResponseEntity.ok(category);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error creating category: " + e.getMessage());
		}
	}
	
	@DeleteMapping("/admin/categories/{categoryId}")
	public ResponseEntity<?> deleteCategory(@PathVariable int categoryId) {
		try {
			categoryService.delete(categoryId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error deleting category: " + e.getMessage());
		}
	}

	@GetMapping("/admin/categories/{categoryId}")
	public ResponseEntity<?> getCategoryDetail(@PathVariable int categoryId) {
		Optional<Category> categoryOptional = categoryService.getById(categoryId);
		return categoryOptional.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/admin/categories/{categoryId}")
	public ResponseEntity<?> updateCategory(@PathVariable int categoryId, @RequestBody Map<String, Object> body) {
		try {
			String categoryName = (String) body.get("categoryName");
			Boolean status = (Boolean) body.get("status");
			Integer parentId = body.get("parentId") != null ? Integer.parseInt(body.get("parentId").toString()) : null;
			Category category = categoryService.getById(categoryId).orElseThrow(() -> new IllegalArgumentException("Category not found"));
			category.setCategoryName(categoryName);
			category.setStatus(status != null ? status : false);
			if (parentId != null) {
				Category parent = categoryRepository.findById(parentId)
						.orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
				category.setParent(parent);
			} else {
				category.setParent(null);
			}
			System.out.println("[UPDATE] categoryId=" + categoryId + ", categoryName=" + categoryName + ", parentId=" + parentId + ", status=" + status);
			System.out.println("[UPDATE] category.getParent()=" + (category.getParent() != null ? category.getParent().getCategoryId() : null));
			categoryService.update(category);
			return ResponseEntity.ok(category);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error updating category: " + e.getMessage());
		}
	}
	
	//Account
	@GetMapping("/admin/accUser")
	public ResponseEntity<?> listUsers(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "username") String sortBy,
			@RequestParam(defaultValue = "asc") String direction,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) Boolean status) {
		
		Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
		Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
		
		Page<Account> accounts;
		if (search != null && !search.isEmpty()) {
			accounts = accService.search(search, pageable);
		} else if (status != null) {
			accounts = accService.findByStatus(status, pageable);
		} else {
			accounts = accService.getAll(pageable);
		}
		
		return ResponseEntity.ok(accounts);
	}
	
	@GetMapping("/admin/accUser/{id}")
	public ResponseEntity<?> viewUser(@PathVariable String id) {
		Optional<Account> account = accService.getById(id);
		return account.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	
	@PostMapping("/admin/accUser/{id}/toggle-status")
	public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
		Optional<Account> accountOpt = accService.getById(id);
		if (accountOpt.isPresent()) {
			Account account = accountOpt.get();
			account.setEnabled(!account.isEnabled());
			accService.save(account);
			return ResponseEntity.ok(account);
		}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("/admin/accUser/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable String id) {
		try {
			accService.delete(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
		}
	}
}
