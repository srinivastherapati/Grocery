package com.example.StoreManagement.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Categories")
@Data
public class CategoryModal {
    @Id
    private String id;
    private String name;
}
