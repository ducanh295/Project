# Dự Án Website Bán Xe

## Giới Thiệu
Đây là một dự án website bán xe được xây dựng với kiến trúc hiện đại, sử dụng công nghệ Spring Boot cho backend và React cho frontend. Dự án được thiết kế để cung cấp trải nghiệm mua sắm xe trực tuyến thân thiện với người dùng.

## Cấu Trúc Dự Án

### 1. Backend (Phần Máy Chủ)

#### Cấu Trúc Thư Mục
```
backend/
├── src/main/java/com/bkap/
│   ├── admin/           # Quản lý phần admin
│   ├── config/          # Cấu hình hệ thống
│   ├── controller/      # Xử lý các request từ client
│   ├── entities/        # Các entity (bảng trong database)
│   ├── models/          # Các model dữ liệu
│   ├── repositories/    # Tương tác với database
│   ├── request/         # Các class xử lý request
│   ├── response/        # Các class xử lý response
│   ├── security/        # Cấu hình bảo mật
│   └── services/        # Xử lý business logic
```

#### Chi Tiết Các Thư Mục

1. **admin/**
   - Chứa các controller và service dành cho quản trị viên
   - Xử lý các chức năng quản lý sản phẩm, đơn hàng, người dùng

2. **config/**
   - `SecurityConfig.java`: Cấu hình bảo mật, phân quyền
   - `WebConfig.java`: Cấu hình CORS, các endpoint
   - `JwtConfig.java`: Cấu hình JWT token

3. **controller/**
   - Xử lý các HTTP request từ client
   - Mỗi controller tương ứng với một resource (UserController, ProductController, etc.)
   - Sử dụng annotation @RestController để xác định REST API endpoints

4. **entities/**
   - Định nghĩa các entity tương ứng với bảng trong database
   - Sử dụng JPA annotations (@Entity, @Table, etc.)
   - Ví dụ: User.java, Product.java, Order.java

5. **models/**
   - Chứa các DTO (Data Transfer Object)
   - Định nghĩa cấu trúc dữ liệu trao đổi giữa client và server

6. **repositories/**
   - Interface kế thừa từ JpaRepository
   - Cung cấp các phương thức CRUD cơ bản
   - Có thể định nghĩa thêm các query tùy chỉnh

7. **request/**
   - Chứa các class xử lý request từ client
   - Validation dữ liệu đầu vào
   - Ví dụ: LoginRequest.java, RegisterRequest.java

8. **response/**
   - Định nghĩa cấu trúc response trả về cho client
   - Bao gồm status code, message, data

9. **security/**
   - JwtTokenProvider.java: Xử lý tạo và validate JWT token
   - UserDetailsServiceImpl.java: Load user từ database
   - SecurityUtils.java: Các tiện ích bảo mật

10. **services/**
    - Chứa business logic
    - Implement các interface service
    - Xử lý dữ liệu trước khi lưu vào database

### 2. Frontend (Phần Giao Diện)

#### Cấu Trúc Thư Mục
```
frontend/src/
├── components/     # Các component tái sử dụng
├── context/       # React Context để quản lý state
├── hooks/         # Custom React hooks
├── pages/         # Các trang chính của ứng dụng
├── services/      # Xử lý API calls
└── utils/         # Các hàm tiện ích
```

#### Chi Tiết Các Thư Mục

1. **components/**
   - Chứa các component có thể tái sử dụng
   - Được tổ chức theo chức năng
   - Ví dụ: Button, Card, Modal, etc.

2. **context/**
   - Quản lý state global của ứng dụng
   - AuthContext: Quản lý trạng thái đăng nhập
   - CartContext: Quản lý giỏ hàng

3. **hooks/**
   - Custom hooks để tái sử dụng logic
   - useAuth: Xử lý authentication
   - useCart: Xử lý giỏ hàng
   - useApi: Xử lý gọi API

4. **pages/**
   - Chứa các component chính của từng trang
   - Được tổ chức theo route
   - Ví dụ: Home, ProductDetail, Cart, etc.

5. **services/**
   - Xử lý các API calls đến backend
   - Sử dụng axios để gọi API
   - Được tổ chức theo resource

## Luồng Hoạt Động Chi Tiết

### 1. Đăng Nhập/Đăng Ký

#### Frontend
1. User nhập thông tin đăng nhập/đăng ký
2. Form validation được thực hiện bởi React
3. Gọi API thông qua service:
```javascript
// services/authService.js
const login = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
};
```

#### Backend
1. Controller nhận request:
```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    // Xử lý đăng nhập
}
```

2. Service xử lý logic:
```java
@Service
public class AuthService {
    public JwtResponse login(LoginRequest request) {
        // Xác thực user
        // Tạo JWT token
        // Trả về response
    }
}
```

3. JWT token được tạo và trả về cho client

### 2. Xem Sản Phẩm

#### Frontend
1. Component gọi API lấy danh sách sản phẩm:
```javascript
// hooks/useProducts.js
const useProducts = () => {
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    const response = await productService.getAll();
    setProducts(response.data);
  };
  
  return { products, fetchProducts };
};
```

2. Hiển thị sản phẩm sử dụng Material-UI:
```javascript
// components/ProductList.js
const ProductList = () => {
  const { products } = useProducts();
  
  return (
    <Grid container>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};
```

#### Backend
1. Controller xử lý request:
```java
@GetMapping("/products")
public ResponseEntity<?> getProducts(
    @RequestParam(required = false) String search,
    @RequestParam(required = false) String category
) {
    // Xử lý lấy danh sách sản phẩm
}
```

2. Service thực hiện logic:
```java
@Service
public class ProductService {
    public Page<Product> getProducts(ProductFilter filter) {
        // Lọc sản phẩm theo điều kiện
        // Phân trang
        // Trả về kết quả
    }
}
```

### 3. Mua Hàng

#### Frontend
1. Thêm vào giỏ hàng:
```javascript
// context/CartContext.js
const addToCart = (product) => {
  setCartItems(prev => [...prev, product]);
};
```

2. Xử lý thanh toán:
```javascript
// services/orderService.js
const createOrder = async (orderData) => {
  const response = await axios.post('/api/orders', orderData);
  return response.data;
};
```

#### Backend
1. Controller xử lý đơn hàng:
```java
@PostMapping("/orders")
public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
    // Xử lý tạo đơn hàng
}
```

2. Service xử lý logic:
```java
@Service
public class OrderService {
    @Transactional
    public Order createOrder(OrderRequest request) {
        // Validate đơn hàng
        // Tạo đơn hàng mới
        // Gửi email xác nhận
        // Trả về kết quả
    }
}
```

## Bảo Mật

### 1. JWT Authentication
- Token được tạo khi đăng nhập
- Mỗi request đều cần gửi token trong header
- Token được validate ở mỗi request

### 2. Password Encryption
- Sử dụng BCrypt để mã hóa mật khẩu
- Salt được tạo ngẫu nhiên cho mỗi user

### 3. CORS Configuration
- Chỉ cho phép các domain được chỉ định
- Giới hạn các HTTP methods được phép

## Hướng Dẫn Phát Triển

### 1. Cài Đặt Môi Trường
1. Cài đặt Java 24
2. Cài đặt Node.js
3. Cài đặt SQL Server
4. Cài đặt Maven

### 2. Cấu Hình Database
1. Tạo database mới trong SQL Server
2. Cập nhật thông tin kết nối trong `application.properties`
3. Chạy script SQL để tạo bảng

### 3. Chạy Dự Án
1. Backend:
```bash
cd backend
mvn spring-boot:run
```

2. Frontend:
```bash
cd frontend
npm install
npm start
```

## Quy Ước Code

### 1. Backend
- Sử dụng camelCase cho tên biến và method
- Sử dụng PascalCase cho tên class
- Comment đầy đủ cho các method phức tạp
- Sử dụng lombok để giảm boilerplate code

### 2. Frontend
- Sử dụng camelCase cho tên biến và function
- Sử dụng PascalCase cho tên component
- Tách logic thành custom hooks
- Sử dụng TypeScript cho type safety

## Xử Lý Lỗi

### 1. Backend
- Sử dụng @ControllerAdvice để xử lý exception
- Trả về response với status code phù hợp
- Log lỗi để debug

### 2. Frontend
- Sử dụng try-catch để bắt lỗi
- Hiển thị thông báo lỗi cho user
- Log lỗi vào console

## Testing

### 1. Backend
- Unit test cho service
- Integration test cho controller
- Sử dụng JUnit và Mockito

### 2. Frontend
- Unit test cho component
- Integration test cho page
- Sử dụng Jest và React Testing Library

## Luồng Dữ Liệu Trong Hệ Thống

### 1. Luồng Đăng Nhập
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Nhập thông tin ----->|
     |   (email/password)        |
     |                          |
     |                          |-- 2. Controller nhận request
     |                          |   (AuthController)
     |                          |
     |                          |-- 3. Service xác thực
     |                          |   (AuthService)
     |                          |
     |                          |-- 4. Repository kiểm tra DB
     |                          |   (UserRepository)
     |                          |
     |                          |-- 5. Tạo JWT token
     |                          |   (JwtTokenProvider)
     |                          |
     |<-- 6. Trả về token ------|
     |                          |
     |-- 7. Lưu token vào       |
     |   localStorage           |
     |                          |
     |-- 8. Chuyển hướng đến    |
     |   trang chủ              |
```

### 2. Luồng Xem Sản Phẩm
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Component mount ----->|
     |   (ProductList)           |
     |                          |
     |                          |-- 2. Controller nhận request
     |                          |   (ProductController)
     |                          |
     |                          |-- 3. Service xử lý logic
     |                          |   (ProductService)
     |                          |
     |                          |-- 4. Repository truy vấn DB
     |                          |   (ProductRepository)
     |                          |
     |<-- 5. Trả về danh sách --|
     |   sản phẩm               |
     |                          |
     |-- 6. Cập nhật state      |
     |   (useProducts hook)     |
     |                          |
     |-- 7. Render UI           |
     |   (ProductCard)          |
```

### 3. Luồng Mua Hàng
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Thêm vào giỏ hàng    |
     |   (CartContext)           |
     |                          |
     |-- 2. Click thanh toán --->|
     |                          |
     |                          |-- 3. Controller nhận request
     |                          |   (OrderController)
     |                          |
     |                          |-- 4. Service xử lý đơn hàng
     |                          |   (OrderService)
     |                          |
     |                          |-- 5. Repository lưu đơn hàng
     |                          |   (OrderRepository)
     |                          |
     |                          |-- 6. Gửi email xác nhận
     |                          |   (EmailService)
     |                          |
     |<-- 7. Trả về kết quả ----|
     |                          |
     |-- 8. Hiển thị thông báo  |
     |   (Toast)                |
     |                          |
     |-- 9. Xóa giỏ hàng        |
     |   (CartContext)          |
```

### 4. Luồng Upload Ảnh
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Chọn file ảnh        |
     |   (FileInput)             |
     |                          |
     |-- 2. Gửi form data ------>|
     |   (multipart/form-data)   |
     |                          |
     |                          |-- 3. Controller nhận file
     |                          |   (FileController)
     |                          |
     |                          |-- 4. Service xử lý file
     |                          |   (FileService)
     |                          |
     |                          |-- 5. Lưu file vào thư mục
     |                          |   (uploads/)
     |                          |
     |                          |-- 6. Lưu path vào DB
     |                          |   (FileRepository)
     |                          |
     |<-- 7. Trả về URL ảnh ----|
     |                          |
     |-- 8. Hiển thị ảnh        |
     |   (Image component)       |
```

### 5. Luồng Tìm Kiếm và Lọc
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Nhập từ khóa         |
     |   (SearchInput)           |
     |                          |
     |-- 2. Chọn bộ lọc          |
     |   (FilterOptions)         |
     |                          |
     |-- 3. Gửi request -------->|
     |   (query parameters)      |
     |                          |
     |                          |-- 4. Controller nhận request
     |                          |   (ProductController)
     |                          |
     |                          |-- 5. Service xử lý tìm kiếm
     |                          |   (ProductService)
     |                          |
     |                          |-- 6. Repository tìm kiếm
     |                          |   (ProductRepository)
     |                          |
     |<-- 7. Trả về kết quả -----|
     |                          |
     |-- 8. Cập nhật UI          |
     |   (ProductList)           |
```

### 6. Luồng Quản Lý Tài Khoản
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Truy cập profile     |
     |   (UserProfile)           |
     |                          |
     |-- 2. Gửi request -------->|
     |   (với JWT token)         |
     |                          |
     |                          |-- 3. Controller xác thực
     |                          |   (UserController)
     |                          |
     |                          |-- 4. Service xử lý
     |                          |   (UserService)
     |                          |
     |                          |-- 5. Repository truy vấn
     |                          |   (UserRepository)
     |                          |
     |<-- 6. Trả về thông tin ---|
     |   người dùng              |
     |                          |
     |-- 7. Hiển thị thông tin   |
     |   (ProfileForm)           |
     |                          |
     |-- 8. Cập nhật thông tin ->|
     |   (nếu có thay đổi)       |
```

### 7. Luồng Xử Lý Lỗi
```
[Frontend]                    [Backend]
     |                            |
     |-- 1. Gặp lỗi khi gọi API ->|
     |                          |
     |                          |-- 2. Controller bắt exception
     |                          |   (@ExceptionHandler)
     |                          |
     |                          |-- 3. Service xử lý lỗi
     |                          |   (ErrorService)
     |                          |
     |                          |-- 4. Log lỗi
     |                          |   (Logger)
     |                          |
     |<-- 5. Trả về response ----|
     |   với error code          |
     |                          |
     |-- 6. Hiển thị thông báo   |
     |   lỗi (Toast)             |
     |                          |
     |-- 7. Xử lý lỗi phù hợp    |
     |   (retry/redirect)        |
```

Mỗi luồng trên đều có các bước xử lý riêng và được kết nối với nhau thông qua các API endpoints. Việc hiểu rõ các luồng này giúp:
1. Dễ dàng debug khi có lỗi
2. Tối ưu hiệu suất hệ thống
3. Thêm tính năng mới một cách có tổ chức
4. Đảm bảo tính bảo mật của hệ thống 