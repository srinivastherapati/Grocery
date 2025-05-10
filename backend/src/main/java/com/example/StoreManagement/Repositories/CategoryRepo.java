package com.example.StoreManagement.Repositories;


import com.example.StoreManagement.Model.CategoryModal;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepo extends MongoRepository<CategoryModal, String> {
    boolean existsByName(String name);
}

