package com.bkap.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bkap.entities.Category;
import com.bkap.entities.Product;
import com.bkap.repositories.CategoryRepository;

@Service
public class CategoryServices {
	@Autowired
	private CategoryRepository repository;
	
	public List<Category> getAll(){
		return repository.findRootCategories();
	}
	public Set<Product> getProduct(int productId){
		return repository.getReferenceById(productId).getProducts();
	}
	public void insert(Category category) {
		repository.save(category);
	}
	public void update(Category category) {
		repository.save(category);
	}
	public Optional<Category> getById(int categoryId) {
		return repository.findById(categoryId);
	}
	public void delete(int topicId) {
		repository.deleteById(topicId);
	}
	public List<Category> getByStatus(boolean status){
		return repository.findByStatus(status);
	}
	public List<Category> searchName(String name){
		return repository.findByNameContain(name);
	}
}
