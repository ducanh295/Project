package com.bkap.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;	
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.bkap.entities.Account;
import com.bkap.entities.AccountDetails;
import com.bkap.entities.Category;
import com.bkap.entities.ERole;
import com.bkap.entities.Order;
import com.bkap.entities.Product;
import com.bkap.entities.Role;
import com.bkap.models.AccountModel;
import com.bkap.models.Item;
import com.bkap.services.AccDetailServices;
import com.bkap.services.CartService;
import com.bkap.services.CategoryServices;
import com.bkap.services.ProductServices;
import com.bkap.services.RoleService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class HomeController {
	@Autowired
	ProductServices productService;
	@Autowired
	CategoryServices categoryService;
	@Autowired
	RoleService roleService;
	@Autowired
	AccDetailServices accDetailService;
	@Autowired
	CartService cartService;
	

	@GetMapping({ "/", "/trang-chu" })
	public String home(Model model) {
		return "home/index";
	}	
	
	@GetMapping("/register")
	public String register(Model model) {

		model.addAttribute("account",new AccountModel());
		return "home/register";
	}

	@PostMapping("/register")
	public String register(@Valid @ModelAttribute("account") AccountModel account,BindingResult result,@RequestParam MultipartFile file, Model model) {
		if(result.hasErrors())
		{
			model.addAttribute("account",account);
			return "home/register";
		}
		if(!account.getPassword().equals(account.getConfirmpassword())) {
			model.addAttribute("msgError","Mật khẩu không khớp");
			model.addAttribute("account",account);
			return "home/register";
		}
		
		 // upload ảnh avatar	
		try {
			
			if (!file.isEmpty()) {
				File imageFolder=new File( new ClassPathResource(".").getFile()+"/static/assets/images");
				if(!imageFolder.exists())
					imageFolder.mkdir();
				Path path=Paths.get(imageFolder.getAbsolutePath(),file.getOriginalFilename());
				System.out.println(path);
				file.transferTo(path);
				account.setPicture(file.getOriginalFilename());
			}
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//khởi tạo role mặc định là User
		Role role = roleService.getByRole(ERole.ROLE_USER);
		//chuyển đổi AccountModel qua account và lưu vào DB
		accDetailService.insert(new Account(account,role));
		return "home/login";
	}
	
	@GetMapping({ "/about-us" })
	public String about(Model model) {
		return "home/about";
	}

	@GetMapping("/shop")
	public String shop(Model model) {
		model.addAttribute("products", productService.getAll());
		model.addAttribute("categories", categoryService.getAll());
		return "home/shop";
	}

	@GetMapping({ "/contact-us" })
	public String contact(Model model) {
		return "home/contact";
	}

	@GetMapping("/login")
	public String login(Model model) {
		return "home/login";
	}
	@GetMapping("/shop/chi-tiet/{productId}")
	public String detail(@PathVariable String productId,Model model, RedirectAttributes redirectAttributes) {
		  Optional<Product> productOptional = productService.getById(productId); 

		    if (productOptional.isPresent()) {
		    	Product product = productOptional.get(); // Lấy sản phẩm ra (an toàn vì đã check isPresent)
		        model.addAttribute("product", product);
		        return "home/detail";
		    } else {
		    redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy sản phẩm với ID: " + productId);
	        return "redirect:/shop"; // Redirect về trang danh sách
		    }

	}

	@GetMapping(value = "/success")
	public String success() {
		// điều hướng login
		try {
			AccountDetails account = (AccountDetails) SecurityContextHolder.getContext().getAuthentication()
					.getPrincipal();
			if (account.getAuthorities().toString().contains(ERole.ROLE_ADMIN.name()))
				return "redirect:/admin";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "redirect:/";
	}
	
	@GetMapping("/cart")
	public String showcart(Model model) {
		return "home/shopingcart";
	}	

	@SuppressWarnings("unchecked")
	@PostMapping("/addcart")
	public String addcart(String productId,Model model,HttpSession session) {
		List<Item> items=new ArrayList<>();
		if(session.getAttribute("cartitems")!=null)
		{
			items=(List<Item>)session.getAttribute("cartitems");
		}
		Product product = productService.getById(productId).orElse(null);
	    if (product != null) {
	        items = cartService.addCart(product, items);
	    }	
		session.setAttribute("cartitems", items);
		model.addAttribute("cartitems",items);
		Double total=items.stream().mapToDouble(Item::getTotal).sum();
		model.addAttribute("totalCart",total);
		return "home/shopingcart";
	}
	
	@SuppressWarnings("unchecked")
	@GetMapping("/removeCart/{id}")
	public String removeCart(@PathVariable("id") String productId,Model model,HttpSession session) {
		List<Item> items=new ArrayList<>();
		if(session.getAttribute("cartitems")!=null)
		{
			items=(List<Item>)session.getAttribute("cartitems");
		}
		items=cartService.removeCart(productId,items);
		session.setAttribute("cartitems", items);
		model.addAttribute("cartitems",items);
		Double total=items.stream().mapToDouble(Item::getTotal).sum();
		model.addAttribute("totalCart",total);
		return "home/shopingcart";
	}
	@SuppressWarnings("unchecked")
	@PostMapping("/updateCart")
	public String updateCart(String[] productids, int[] quantities,Model model,HttpSession session) {
		List<Item> items=new ArrayList<>();
		if(session.getAttribute("cartitems")!=null)
		{
			items=(List<Item>)session.getAttribute("cartitems");
		}
		items=cartService.updateCart( productids,  quantities,items);
		session.setAttribute("cartitems", items);
		model.addAttribute("cartitems",items);
		Double total=items.stream().mapToDouble(Item::getTotal).sum();
		model.addAttribute("totalCart",total);
		return "home/shopingcart";
	}
	@SuppressWarnings("unchecked")
	@PostMapping("/checkout")
	public String checkout(Order order, Model model,HttpSession session) {
		List<Item> items=new ArrayList<>();
		if(session.getAttribute("cartitems")!=null)
		{
			items=(List<Item>)session.getAttribute("cartitems");
		}
		String msg=cartService.insertOrder(order,items);
		model.addAttribute("msg",msg);
		session.setAttribute("cartitems", new ArrayList<>());
		return "redirect:/";
	}
	
	
	
}
