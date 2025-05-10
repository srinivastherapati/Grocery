package com.example.StoreManagement.Controllers;


import com.example.StoreManagement.Model.CategoryModal;
import com.example.StoreManagement.Repositories.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepo categoryRepo;

    @PostMapping("/add")
    public ResponseEntity<?> createCategory(@RequestBody String name) {
        String categoryName=name.substring(0,name.length()-1);
        if (categoryRepo.existsByName(categoryName)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Category already exists");
        }
        CategoryModal category = new CategoryModal();
        category.setName(categoryName.toUpperCase());
        categoryRepo.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category created successfully");
    }

    @GetMapping("/all")
    public List<CategoryModal> getAllCategories() {
        return categoryRepo.findAll();
    }
}

