package com.example.StoreManagement.Service;

import com.example.StoreManagement.Model.Category;
import com.example.StoreManagement.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public Category createCategory(Category category) {
        // Basic validation: Check if category with the same name already exists
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new IllegalStateException("Category with name '" + category.getName() + "' already exists.");
        }
        return categoryRepository.save(category);
    }
    
    // Add other methods if needed, e.g., updateCategory, deleteCategory
}
