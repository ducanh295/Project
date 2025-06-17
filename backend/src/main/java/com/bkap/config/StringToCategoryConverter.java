package com.bkap.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import org.springframework.lang.Nullable;

import com.bkap.entities.Category;
import com.bkap.services.CategoryServices;

@Component
public class StringToCategoryConverter implements Converter<String, Category>{
	@Autowired
    private CategoryServices categoryService; // Inject Service hoặc Repository để tìm Category

    @Override
    @Nullable // Đánh dấu phương thức có thể trả về null
    public Category convert(String sourceCategoryId) { // sourceCategoryId là ID dạng String từ form
        if (sourceCategoryId == null || sourceCategoryId.isEmpty()) {
            // Nếu không có ID được chọn từ dropdown (ví dụ: chọn "-- Chọn Danh Mục --")
            return null;
        }

        try {
            // Chuyển đổi String ID sang kiểu dữ liệu thực tế của ID trong Category Entity
            // Ví dụ: Nếu ID là Integer
            Integer categoryId = Integer.parseInt(sourceCategoryId);

            // // Ví dụ: Nếu ID là Long
            // Long categoryId = Long.parseLong(sourceCategoryId);

            // Dùng Service/Repository để tìm Category trong CSDL bằng ID đã chuyển đổi
            // Nên sử dụng phương thức trả về Optional để xử lý trường hợp không tìm thấy
            Optional<Category> categoryOptional = categoryService.getById(categoryId); // Giả sử có phương thức findById

            // Nếu tìm thấy, trả về đối tượng Category được quản lý.
            // Nếu không tìm thấy, trả về null.
            return categoryOptional.orElse(null);

        } catch (NumberFormatException e) {
            // Xử lý trường hợp sourceCategoryId không phải là số hợp lệ
            // Ghi log lỗi hoặc xử lý theo cách phù hợp
            System.err.println("Lỗi chuyển đổi ID Category từ String: '" + sourceCategoryId + "' không phải là số hợp lệ.");
            return null; // Trả về null nếu không chuyển đổi được ID
        } catch (Exception e) {
            // Bắt các lỗi khác có thể xảy ra khi gọi service
            System.err.println("Lỗi khi tìm Category với ID: " + sourceCategoryId + " - " + e.getMessage());
            return null;
        }
    }
}
