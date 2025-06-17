package com.bkap.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bkap.entities.Product;

public interface ProductRepository extends JpaRepository<Product,String> {
	public List<Product> findTop5ByOrderByProductIdAsc();
	@Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
	List<Product> findByNameContain(@Param("name") String name);
	List<Product> findByStatus(boolean status);
	List<Product> findByCategoryCategoryId(Integer categoryId);
}
