package com.bkap.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bkap.entities.Account;
import com.bkap.entities.AccountDetails;
import com.bkap.entities.CartItem;
import com.bkap.entities.Category;
import com.bkap.entities.ERole;
import com.bkap.entities.Order;
import com.bkap.entities.Product;
import com.bkap.entities.Role;
import com.bkap.models.AccountModel;
import com.bkap.models.Item;
import com.bkap.request.LoginRequest;
import com.bkap.response.JwtResponse;
import com.bkap.security.jwt.JwtUtils;
import com.bkap.services.AccDetailServices;
import com.bkap.services.CartService;
import com.bkap.services.CategoryServices;
import com.bkap.services.EmailService;
import com.bkap.services.OTPService;
import com.bkap.services.ProductServices;
import com.bkap.services.RoleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeRestController {
    
    @Autowired
    private ProductServices productService;
    
    @Autowired
    private CategoryServices categoryService;
    
    @Autowired
    private RoleService roleService;
    
    @Autowired
    private AccDetailServices accDetailService;
    
    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OTPService otpService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Product APIs
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) String name) {
        List<Product> products;
        if (name != null && !name.trim().isEmpty()) {
            products = productService.searchProductsByName(name);
        } else {
            products = productService.getAll();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Optional<Product> product = productService.getById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Category APIs
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/categories/{categoryId}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(productService.getByCategory(categoryId));
    }

    // Authentication APIs
    @PostMapping("/register")
    public ResponseEntity<?> register(@ModelAttribute AccountModel account, @RequestParam(required = false) MultipartFile file) {
        try {
            // Validate input
            if (account == null) {
                return ResponseEntity.badRequest().body(Map.of("general", "Account data is required"));
            }
            
            // Log input data
            System.out.println("Registering account: " + account.getUsername());
            
            Map<String, String> errors = new HashMap<>();

            // Check if username exists
            if (accDetailService.findByUsername(account.getUsername().trim()).isPresent()) {
                errors.put("username", "Username already exists");
            }
            
            // Check if email exists
            if (accDetailService.findByEmail(account.getEmail().trim()).isPresent()) {
                errors.put("email", "Email already exists");
            }

            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(errors);
            }
            
            // Handle file uploadss
            if (file != null && !file.isEmpty()) {
                try {
                    String fileName = file.getOriginalFilename();
                    Path uploadPath = Paths.get("uploads");
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    account.setAvatar(fileName);
                } catch (IOException e) {
                    System.err.println("Error uploading file: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error uploading file: " + e.getMessage());
                }
            }
            
            // Create account
            try {
                Role role = roleService.findByName(ERole.ROLE_USER);
                if (role == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Default role not found");
                }
                
                Account newAccount = new Account(account, role);
                System.out.println("Created account object: " + newAccount.toString());
                
                Account savedAccount = accDetailService.insert(newAccount);
                System.out.println("Saved account: " + savedAccount.toString());
                
                return ResponseEntity.ok(savedAccount);
            } catch (Exception e) {
                System.err.println("Error creating account: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating account: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Unexpected error in register: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        AccountDetails userDetails = (AccountDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                                                 userDetails.getAccountId(), 
                                                 userDetails.getUsername(), 
                                                 userDetails.getEmail(), 
                                                 userDetails.getFullName(), 
                                                 roles));
    }

    // Cart APIs
    @GetMapping("/cart")
    public ResponseEntity<List<Item>> getCart() {
        try {
            // Lấy thông tin người dùng hiện tại từ SecurityContextHolder
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AccountDetails userDetails = (AccountDetails) authentication.getPrincipal();
            String accountId = userDetails.getAccountId();

            List<CartItem> cartItems = cartService.getCartItems(accountId);
            List<Item> items = cartItems.stream()
                                        .map(cartItem -> {
                                            Item item = new Item(cartItem.getProduct());
                                            item.setQuantity(cartItem.getQuantity());
                                            item.setTotal(cartItem.getProduct().getPrice() * cartItem.getQuantity());
                                            return item;
                                        })
                                        .collect(Collectors.toList());

            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ArrayList<Item>());
        }
    }

    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(@RequestParam String productId) {
        try {
            // Lấy thông tin người dùng hiện tại
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AccountDetails userDetails = (AccountDetails) authentication.getPrincipal();
            String accountId = userDetails.getAccountId();

            // Sử dụng phương thức addToCart của CartService để lưu vào DB
            cartService.addToCart(accountId, productId, 1); // Thêm 1 sản phẩm vào giỏ hàng
            
            return ResponseEntity.ok("Sản phẩm đã được thêm vào giỏ hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm vào giỏ hàng: " + e.getMessage());
        }
    }

    @DeleteMapping("/cart/remove-item")
    public ResponseEntity<?> removeFromCart(@RequestParam String productId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AccountDetails userDetails = (AccountDetails) authentication.getPrincipal();
            String accountId = userDetails.getAccountId();

            cartService.removeFromCart(accountId, productId);
            return ResponseEntity.ok("Sản phẩm đã được xóa khỏi giỏ hàng!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xóa khỏi giỏ hàng: " + e.getMessage());
        }
    }

    @PutMapping("/cart/update")
    public ResponseEntity<?> updateCart(@RequestParam String productId, @RequestParam int quantity) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AccountDetails userDetails = (AccountDetails) authentication.getPrincipal();
            String accountId = userDetails.getAccountId();
            
            cartService.updateCart(accountId, productId, quantity);
            return ResponseEntity.ok("Cập nhật giỏ hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật giỏ hàng: " + e.getMessage());
        }
    }

    // Order APIs
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Order order) {
        try {
            List<Item> items = new ArrayList<>();
            String result = cartService.insertOrder(order, items);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thanh toán: " + e.getMessage());
        }
    }

    // User APIs
    @GetMapping("/user/current")
    public ResponseEntity<?> getCurrentUser() {
        try {
            AccountDetails account = (AccountDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy thông tin người dùng");
        }
    }

    // Forgot Password APIs
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            Optional<Account> account = accDetailService.findByEmail(email);
            if (!account.isPresent()) {
                return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống");
            }
            
            // Generate OTP
            String otp = generateOTP();
            
            // Save OTP
            otpService.saveOTP(email, otp);
            
            // Send OTP via email
            try {
                emailService.sendOTPEmail(email, otp);
                return ResponseEntity.ok(Map.of(
                    "message", "OTP đã được gửi đến email của bạn"
                ));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi gửi email: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi xử lý yêu cầu quên mật khẩu: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        try {
            Optional<Account> account = accDetailService.findByEmail(email);
            if (!account.isPresent()) {
                return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống");
            }

            // Verify OTP
            if (!otpService.validateOTP(email, otp)) {
                return ResponseEntity.badRequest().body("Mã OTP không hợp lệ hoặc đã hết hạn");
            }

            // Update password
            Account acc = account.get();
            acc.setPassword(passwordEncoder.encode(newPassword)); // Encode the new password
            accDetailService.insert(acc);

            return ResponseEntity.ok("Mật khẩu đã được đặt lại thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi đặt lại mật khẩu: " + e.getMessage());
        }
    }

    @PostMapping("/user/update-profile")
    public ResponseEntity<?> updateProfile(@ModelAttribute AccountModel model, @RequestParam(required = false) MultipartFile file) {
        try {
            AccountDetails userDetails = (AccountDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<Account> optionalAccount = accDetailService.findByUsername(userDetails.getUsername());
            if (!optionalAccount.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy tài khoản");
            }
            Account account = optionalAccount.get();
            // Chuyển chuỗi trắng thành null
            account.setFullname(isBlankToNull(model.getFullname()));
            account.setPhone(isBlankToNull(model.getPhone()));
            account.setAddress(isBlankToNull(model.getAddress()));
            account.setDateOfBirth(model.getDateOfBirth() != null && !model.getDateOfBirth().isEmpty() ? java.time.LocalDate.parse(model.getDateOfBirth()) : null);
            account.setGender(isBlankToNull(model.getGender()));
            account.setNationality(isBlankToNull(model.getNationality()));
            account.setHobbies(isBlankToNull(model.getHobbies()));
            account.setBio(isBlankToNull(model.getBio()));
            
            // Handle file upload for picture
            if (file != null && !file.isEmpty()) {
                try {
                    String fileName = file.getOriginalFilename();
                    Path uploadPath = Paths.get("uploads");
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    account.setPicture(fileName);
                } catch (IOException e) {
                    System.err.println("Error uploading file: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Lỗi khi tải ảnh lên: " + e.getMessage());
                }
            } else if (model.getPicture() != null && model.getPicture().isEmpty()) {
                // If the client explicitly sends an empty string for picture, set it to null in the database
                account.setPicture(null);
            }
            
            accDetailService.insert(account);
            return ResponseEntity.ok("Cập nhật hồ sơ thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật hồ sơ: " + e.getMessage());
        }
    }

    // Hàm tiện ích: chuyển chuỗi trắng hoặc null thành null
    private String isBlankToNull(String value) {
        return (value == null || value.trim().isEmpty()) ? null : value;
    }

    private String generateOTP() {
        // Generate a 6-digit OTP
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
} 