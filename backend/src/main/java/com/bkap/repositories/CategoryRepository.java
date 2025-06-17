package com.bkap.repositories;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bkap.entities.Category;
import com.bkap.entities.Product;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
	public List<Category> findByParentNull();
    boolean existsByCategoryName(String categoryName);
    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Integer categoryId);
	@Query("SELECT c FROM Category c WHERE categoryName LIKE %:name%")
	List<Category> findByNameContain(@Param("name") String name);
	List<Category> findByStatus(boolean status);
	@Query("SELECT c FROM Category c WHERE c.parent IS NULL ORDER BY c.categoryName ASC")
    List<Category> findRootCategories();
	@Query("SELECT c FROM Category c LEFT JOIN FETCH c.subcategories WHERE c.id = :categoryId")
	Optional<Category> findByIdWithSubcategories(@Param("categoryId") Integer categoryId);

	// Lấy tất cả ID con cháu (bao gồm cả con trực tiếp)
	default Set<Integer> findAllDescendantIds(Integer categoryId) {
	    Set<Integer> descendantIds = new HashSet<>();
	    Optional<Category> categoryOpt = findByIdWithSubcategories(categoryId); // Cần fetch con

	    if (categoryOpt.isPresent()) {
	        List<Category> children = categoryOpt.get().getSubcategories();
	        if (children != null && !children.isEmpty()) {
	            descendantIds.addAll(children.stream().map(Category::getCategoryId).collect(Collectors.toSet()));
	            for (Category child : children) {
	                descendantIds.addAll(findAllDescendantIds(child.getCategoryId())); // Đệ quy
	            }
	        }
	    }
	    return descendantIds;
	}		
}

