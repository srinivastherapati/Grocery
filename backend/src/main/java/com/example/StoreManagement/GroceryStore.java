package com.example.StoreManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class GroceryStore {

	public static void main(String[] args) {
		SpringApplication.run(GroceryStore.class, args);
	}

}
