package com.example.StoreManagement.Controllers;

import com.example.StoreManagement.Model.Category;
import com.example.StoreManagement.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories") // Base path for category-related endpoints
@CrossOrigin // Enable CORS for frontend access
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Endpoint to create a new category
    @PostMapping("/add")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name cannot be empty.");
        }
        // Description is optional
        try {
            Category newCategory = categoryService.createCategory(new Category(category.getName(), category.getDescription()));
            return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating category: " + e.getMessage());
        }
    }

    // Endpoint to get all categories
    @GetMapping("/get")
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            if (categories.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(categories);
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Or a more specific error response
        }
    }

    // Optional: Endpoint to get a category by name (if needed)
    @GetMapping("/getByName")
    public ResponseEntity<?> getCategoryByName(@RequestParam String name) {
        Optional<Category> category = categoryService.findCategoryByName(name);
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with name '" + name + "' not found.");
        }
    }
}
