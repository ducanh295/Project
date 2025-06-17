package com.bkap.admin.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.bkap.entities.Account;
import com.bkap.entities.Category;
import com.bkap.entities.Product;
import com.bkap.repositories.CategoryRepository;
import com.bkap.services.AccService;
import com.bkap.services.CategoryServices;
import com.bkap.services.ProductServices;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/admin")
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
	@GetMapping("products")
	public String index(Model model) {
		model.addAttribute("products",productService.getAll());
		return "admin/products/index";
	}
	
	@GetMapping("/products/tim-kiem")
	public String search(String searchname, int status, Model model) {
		model.addAttribute("status",status);
		if(searchname.isEmpty())
		{
			model.addAttribute("products",productService.getByStatus(status==1?true:false));
			return "admin/products/index";
		}else
		{
			model.addAttribute("products",productService.searchProductsByName(searchname));
			return "admin/products/index";
		}
	}
	
	@GetMapping("/products/them-moi")
	public String create(Model model) {
		model.addAttribute("product",new Product());
		List<Category> listOfCategories = categoryService.getAll();
		 model.addAttribute("categories", listOfCategories);
		return "admin/products/create";
	}
	
	@PostMapping("/products/ghi")
	public String create(@Valid Product product, BindingResult result, Model model, @RequestParam MultipartFile file, RedirectAttributes redirectAttributes) {
		if(result.hasErrors()) {
			model.addAttribute("product",product);
			return "admin/products/create";
		}
		try {
			if (!file.isEmpty()) {
				File imageFolder=new File( new ClassPathResource(".").getFile()+"/static/assets/images");
				if(!imageFolder.exists())
					imageFolder.mkdir();
				Path path=Paths.get(imageFolder.getAbsolutePath(),file.getOriginalFilename());
				System.out.println(path);
				file.transferTo(path);
				product.setPictures("/assets/images/"+file.getOriginalFilename());
			}
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}	
		productService.update(product);
		return "redirect:/admin/products";
	}
	
	@GetMapping("/products/xoa/{productId}")
	public String delete(@PathVariable String productId) {
	    System.out.println("Attempting to delete product with ID (String): " + productId); // Thêm log để kiểm tra
	    try {
	        productService.delete(productId);
	        System.out.println("Product deletion service called for ID: " + productId);
	    } catch (Exception e) {
	        System.err.println("Error during deletion of product ID " + productId + ": " + e.getMessage());
	        e.printStackTrace(); 
	    }
	    return "redirect:/admin/products";
	}

	@GetMapping("/products/chi-tiet/{productId}")
	public String detail(@PathVariable String productId,Model model, RedirectAttributes redirectAttributes) {
		  Optional<Product> productOptional = productService.getById(productId); // Gọi service đã sửa

		    if (productOptional.isPresent()) {
		    	Product product = productOptional.get(); // Lấy sản phẩm ra (an toàn vì đã check isPresent)
		        model.addAttribute("product", product);
		        return "admin/products/detail";
		    } else {
		    redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy sản phẩm với ID: " + productId);
	        return "redirect:/admin/products"; // Redirect về trang danh sách
		    }

	}
		
	@GetMapping("/products/sua/{productId}")
	public String edit(@PathVariable String productId, Model model) {
		model.addAttribute("product",productService.getById(productId));
		return "admin/products/edit";
	}
	
	@PostMapping("/products/cap-nhat")
	public String edit(@Valid Product product, BindingResult result, Model model) {
		if(result.hasErrors()) {
			model.addAttribute("product",product);
			return "admin/products/edit";
		}
		productService.update(product);
		return "redirect:/admin/products";
	}
	
//	Category
	@GetMapping("categories")
	public String cateIndex(Model model) {
		model.addAttribute("categories",categoryService.getAll());
		return "admin/categories/index";
	}
	
	@GetMapping("/categories/tim-kiem")
	public String cateSearch(String searchname, int status, Model model) {
		model.addAttribute("status",status);
		if(searchname.isEmpty())
		{
			model.addAttribute("categories",categoryService.getByStatus(status==1?true:false));
			return "admin/categories/index";
		}else
		{
			model.addAttribute("categories",categoryService.searchName(searchname));
			return "admin/categories/index";
		}
	}
	
	@GetMapping("/categories/them-moi")
	public String cateCreate(Model model) {
		List<Category> potentialParents = categoryRepository.findRootCategories();
		model.addAttribute("category",new Category());
		model.addAttribute("potentialParents",potentialParents);
		return "admin/categories/create";
	}
	@PostMapping("/categories/them-moi")
	public String createSubmit(@ModelAttribute("category") @Valid Category newCategory, // @Valid nếu dùng validation
            BindingResult bindingResult, // Kết quả validation
            @RequestParam(value = "parentId", required = false) Integer parentId, // Lấy parentId từ form
            RedirectAttributes redirectAttributes,
            Model model) {

				// --- Validation cơ bản ---
				if (parentId == null) {
				bindingResult.rejectValue("parent", "error.category", "Vui lòng chọn danh mục cha.");
				}
				if (categoryRepository.existsByCategoryName(newCategory.getCategoryName())) {
				bindingResult.rejectValue("categoryName", "error.category", "Tên danh mục đã tồn tại.");
				}
				
				if (bindingResult.hasErrors()) {
				// Nếu có lỗi, tải lại danh sách cha và trả về form
					List<Category> potentialParents = categoryRepository.findRootCategories();
				model.addAttribute("potentialParents", potentialParents);
				return "admin/categories/form"; // Trả về form với lỗi
				}
				
				try {
				// Tìm đối tượng cha
				Category parentCategory = categoryRepository.findById(parentId)
				 .orElseThrow(() -> new IllegalArgumentException("Danh mục cha không hợp lệ: " + parentId));
				
				newCategory.setParent(parentCategory); // Thiết lập quan hệ
				categoryRepository.save(newCategory);
				
				redirectAttributes.addFlashAttribute("successMessage", "Thêm danh mục con thành công!");
				return "redirect:/admin/categories"; // Chuyển hướng về trang danh sách
				
				} catch (Exception e) {
				// Xử lý lỗi chung hoặc lỗi không tìm thấy cha
				List<Category> potentialParents = categoryRepository.findAll();
				model.addAttribute("potentialParents", potentialParents);
				model.addAttribute("errorMessage", "Lỗi khi thêm danh mục: " + e.getMessage());
				// Log lỗi e.printStackTrace();
				return "admin/categories/form"; // Trả về form với lỗi
				}
				}
	
	@GetMapping("/categories/xoa/{categoryId}")
	public String cateDelete(@PathVariable int categoryId) {
		categoryService.delete(categoryId);
	    return "redirect:/admin/products";
	}

	@GetMapping("/categories/chi-tiet/{categoryId}")
	public String cateDetail(@PathVariable int categoryId, Model model, RedirectAttributes redirectAttributes) { // Thêm RedirectAttributes
        // Giả sử getById trả về Optional<Category>
		Optional<Category> categoryOpt = categoryService.getById(categoryId);

        if(categoryOpt.isPresent()){
            // Nếu tìm thấy, thêm vào model với tên là "category"
            model.addAttribute("category", categoryOpt.get());
		    return "admin/categories/detail"; // Trả về view detail
        } else {
            // Nếu không tìm thấy, đặt thông báo lỗi và chuyển hướng
             redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy danh mục với ID: " + categoryId);
             return "redirect:/admin/categories"; // Chuyển hướng về trang danh sách
        }
	}
		
	@GetMapping("/categories/sua/{id}")
    public String cateEditForm(@PathVariable("id") Integer id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Category> categoryOpt = categoryRepository.findById(id); // Lấy category cần sửa

        if (categoryOpt.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy danh mục ID: " + id);
            return "redirect:/admin/categories";
        }

        Category categoryToEdit = categoryOpt.get();

        List<Category> allCategories = categoryRepository.findAll();
        Set<Integer> excludedIds = categoryRepository.findAllDescendantIds(id);
        excludedIds.add(id); // Thêm chính nó vào danh sách loại trừ

        // 3. Lọc ra những danh mục không nằm trong danh sách loại trừ
        List<Category> potentialParents = allCategories.stream()
                .filter(cat -> !excludedIds.contains(cat.getCategoryId()))
                .collect(Collectors.toList());

        model.addAttribute("category", categoryToEdit);
        model.addAttribute("potentialParents", potentialParents); // Danh sách cha hợp lệ
        return "admin/categories/edit"; // Trả về view edit mới
    }

    // --- SỬA: Xử lý POST ---
    @PostMapping("/categories/sua") // Đổi thành /sua để xử lý POST từ form edit
    public String cateEditSubmit(@ModelAttribute("category") @Valid Category editedCategoryData,
                                 BindingResult bindingResult,
                                 @RequestParam(value = "parentId", required = false) Integer parentId, // Lấy parentId được chọn
                                 RedirectAttributes redirectAttributes,
                                 Model model) {

        Integer categoryId = editedCategoryData.getCategoryId();
        boolean hasErrors = false;

        if (categoryId == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "ID danh mục không hợp lệ.");
            return "redirect:/admin/categories"; // Không có ID thì không sửa được
        }

        // --- Validation ---
        // Kiểm tra trùng tên (ngoại trừ chính nó)
        if (!bindingResult.hasFieldErrors("categoryName") &&
            categoryRepository.existsByCategoryNameAndCategoryIdNot(editedCategoryData.getCategoryName(), categoryId)) {
            bindingResult.rejectValue("categoryName", "error.category.name.duplicate", "Tên danh mục đã tồn tại.");
            hasErrors = true;
        }

        // Kiểm tra vòng lặp cha-con
        if (parentId != null) {
            if (parentId.equals(categoryId)) {
                // Thêm lỗi vào Model thay vì BindingResult vì không có field `parentId` trực tiếp
                model.addAttribute("parentError", "Không thể chọn chính nó làm danh mục cha.");
                hasErrors = true;
            } else {
                Set<Integer> descendantIds = categoryRepository.findAllDescendantIds(categoryId);
                if (descendantIds.contains(parentId)) {
                    model.addAttribute("parentError", "Không thể chọn một danh mục con hoặc cháu làm danh mục cha.");
                    hasErrors = true;
                }
            }
        }
         if (bindingResult.hasErrors()) { // Lỗi từ @Valid
            hasErrors = true;
        }
        // --- Kết thúc Validation ---


        if (hasErrors) {
            // Nếu có lỗi, tải lại danh sách cha tiềm năng hợp lệ và trả về form
            List<Category> allCategories = categoryRepository.findAll();
            Set<Integer> excludedIds = categoryRepository.findAllDescendantIds(categoryId);
            excludedIds.add(categoryId);
            List<Category> potentialParents = allCategories.stream()
                    .filter(cat -> !excludedIds.contains(cat.getCategoryId()))
                    .collect(Collectors.toList());

            model.addAttribute("potentialParents", potentialParents);
            model.addAttribute("selectedParentId", parentId); // Giữ lại lựa chọn parentId khi lỗi
            // Không cần addAttribute("category", ...) vì @ModelAttribute đã làm
            return "admin/categories/edit"; // Trả về form edit với lỗi
        }

        // --- Persistence ---
        try {
            Category categoryToUpdate = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại: " + categoryId));

            // Cập nhật các trường
            categoryToUpdate.setCategoryName(editedCategoryData.getCategoryName());
            categoryToUpdate.setStatus(editedCategoryData.isStatus());

            // Cập nhật cha
            if (parentId == null) {
                categoryToUpdate.setParent(null); // Đặt thành danh mục gốc
            } else {
                Category chosenParent = categoryRepository.findById(parentId)
                        .orElseThrow(() -> new IllegalArgumentException("Danh mục cha được chọn không hợp lệ: " + parentId));
                categoryToUpdate.setParent(chosenParent);
            }

            categoryRepository.save(categoryToUpdate); // Lưu thay đổi

            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật danh mục '" + categoryToUpdate.getCategoryName() + "' thành công!");
            return "redirect:/admin/categories";

        } catch (Exception e) {
            // Xử lý lỗi khi lưu
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi khi cập nhật danh mục: " + e.getMessage());
             // Log lỗi e.printStackTrace();
             // Redirect về form edit với ID để người dùng thử lại
            return "redirect:/admin/categories/sua/" + categoryId;
        }
    }
	
	@PostMapping("/categories/cap-nhat")
	public String cateEdit(@Valid Category category, BindingResult result, Model model) {
		if(result.hasErrors()) {
			model.addAttribute("category",category);
			return "admin/categories/edit";
		}
		categoryService.update(category);
		return "redirect:/admin/categories";
	}
	
	//Account
	@GetMapping("accUser")
	public String listUsers(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "username") String sortBy,
			@RequestParam(defaultValue = "asc") String direction,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) Boolean status,
			Model model) {
		
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
		
		model.addAttribute("accounts", accounts);
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", accounts.getTotalPages());
		model.addAttribute("totalItems", accounts.getTotalElements());
		model.addAttribute("sortBy", sortBy);
		model.addAttribute("direction", direction);
		model.addAttribute("search", search);
		model.addAttribute("status", status);
		
		return "admin/accUser/index";
	}
	
	@GetMapping("/accUser/{id}")
	public String viewUser(@PathVariable String id, Model model) {
		Optional<Account> account = accService.getById(id);
		if (account.isPresent()) {
			model.addAttribute("account", account.get());
			return "admin/accUser/view";
		}
		return "redirect:/admin/accUser";
	}
	
	@PostMapping("/accUser/{id}/toggle-status")
	public String toggleUserStatus(@PathVariable String id, RedirectAttributes redirectAttributes) {
		Optional<Account> accountOpt = accService.getById(id);
		if (accountOpt.isPresent()) {
			Account account = accountOpt.get();
			account.setEnabled(!account.isEnabled());
			accService.save(account);
			redirectAttributes.addFlashAttribute("successMessage", 
				"User status updated successfully");
		} else {
			redirectAttributes.addFlashAttribute("errorMessage", 
				"User not found");
		}
		return "redirect:/admin/accUser";
	}
	
	@PostMapping("/accUser/{id}/delete")
	public String deleteUser(@PathVariable String id, RedirectAttributes redirectAttributes) {
		try {
			accService.delete(id);
			redirectAttributes.addFlashAttribute("successMessage", 
				"User deleted successfully");
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("errorMessage", 
				"Error deleting user: " + e.getMessage());
		}
		return "redirect:/admin/accUser";
	}
}
