package com.example.StoreManagement.Controllers;

import com.example.StoreManagement.Model.Products;
import com.example.StoreManagement.Repositories.ProductsRepo;
import com.example.StoreManagement.Service.CategoryService;
import com.example.StoreManagement.Service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional; // Ensure Optional is imported, though likely already present
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductsController {
    @Autowired
    private ProductsService productsService;
    @Autowired
    private ProductsRepo productsRepo;
    private final CategoryService categoryService;

    @Autowired
    public ProductsController(ProductsService productsService, ProductsRepo productsRepo, CategoryService categoryService) {
        this.productsService = productsService;
        this.productsRepo = productsRepo;
        this.categoryService = categoryService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> createProduct(@RequestBody Products products){
        System.out.println("entered add product");
        System.out.println(products.getCategory());
        if(products.getName()==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product name can't be  null");
        }

        if(productsService.isProductExists(products.getName())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("there exists a product with name" + products.getName());
        }
        if(products.getDescription()==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product description can't be  null");
        }
        if(products.getImageUrl()==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product image required");
        }

        // New category validation
        if (products.getCategory() == null || products.getCategory().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Product category cannot be empty.");
        }
        Optional<com.example.StoreManagement.Model.Category> categoryOptional = categoryService.findCategoryByName(products.getCategory().trim());
        if (categoryOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid category: " + products.getCategory() + ". This category does not exist.");
        }
        // Set category from validated category object, ensuring consistency (e.g. case)
        products.setCategory(categoryOptional.get().getName());
        products.setRefundable(true); // Defaulting to true

        if (products.getStock()<0){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("stock values can't be negative");
        }

        if(products.getPrice()<0){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("product price can't be negative");
        }
        if (products.getUnits()==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Units rae required");
        }
        products.setRating(0);

        productsRepo.save(products);
        return ResponseEntity.status(HttpStatus.CREATED).body("product added successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProductByName(@PathVariable String id) {
        System.out.println("entrred delete ;product");
        // Check if the product exists by name
        Products products=productsRepo.findById(id).orElse(null);
        if (products==null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product with id " + id + " does not exist.");
        }
        System.out.println(products.getName());

        // Perform the delete operation
        productsService.deleteProductByName(products.getName());
        return ResponseEntity.ok("Product with name " + products.getName() + " has been deleted successfully.");
    }
    @PatchMapping("/update-quantity/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable String id,@RequestBody String  type) {
        Products item = productsRepo.findById(id).orElse(null);
        if (item == null ) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found in cart");
        }
        item.setStock(type.equals("increment")?item.getStock()+1:item.getStock()-1);
        productsRepo.save(item);
        return ResponseEntity.ok("Quantity updated");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable String id,
            @RequestBody Products updateRequest) {
        System.out.println("entered update item");
        System.out.println(updateRequest);
        System.out.println(id);
        // Check if the product exists
        Optional<Products> optionalProduct = productsService.getProductById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product with ID " + id + " not found.");
        }

        // Update fields selectively
        Products product = optionalProduct.get();
        if (updateRequest.getPrice()>0) {
            product.setPrice(updateRequest.getPrice());
        }
        if(productsRepo.findByName(updateRequest.getName())!=null){
            product.setName(updateRequest.getName());
        }
        if (updateRequest.getStock() >0) {
            product.setStock(updateRequest.getStock());
        }

        if (updateRequest.getDescription() != null) {
            product.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getUnits() != null) {
            product.setUnits(updateRequest.getUnits());
        }
        if(updateRequest.getImageUrl()!=null){
            product.setImageUrl(updateRequest.getImageUrl());
        }
        if (updateRequest.getCategory() != null && !updateRequest.getCategory().trim().isEmpty()) {
            Optional<com.example.StoreManagement.Model.Category> categoryOptional = categoryService.findCategoryByName(updateRequest.getCategory().trim());
            if (categoryOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid category: " + updateRequest.getCategory() + ". This category does not exist.");
            }
            product.setCategory(categoryOptional.get().getName()); // Set the validated category name
        } else if (updateRequest.getCategory() != null && updateRequest.getCategory().trim().isEmpty()) {
            // Handle case where category is explicitly set to empty if allowed, or return bad request
            return ResponseEntity.badRequest().body("Product category cannot be set to empty.");
        }

        // Save the updated product
        productsRepo.save(product);
        return ResponseEntity.ok("Product updated successfully.");
    }
    @GetMapping("/get")
    private ResponseEntity<?> getProducts(@RequestParam(required = false) String category,
                                          @RequestParam(required = false) String product
                                         // @RequestParam(defaultValue = "asc",required = false) String sortOrder
                                          ){
        if(category!=null){
            List<Products> productsByCategory=productsRepo.findByCategory(category);
            if(!productsByCategory.isEmpty())
                return ResponseEntity.ok(productsByCategory);
            else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no products available for the category"+category);
            }
        }
        else if(product!=null){
            Products products=productsRepo.findByName(product);
            if(products!=null){
                return ResponseEntity.ok(products);
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no products available with name"+product);
            }
        }
        else{
        List<Products> productsList=productsRepo.findAll();
        return ResponseEntity.ok(productsList);
        }
    }

//    @GetMapping("/get")
//    private ResponseEntity<?> getProductsByCategory(@RequestParam String category){
//        List<Products> productsByCategory=productsRepo.findByCategory(category);
//        if(!productsByCategory.isEmpty())
//         return ResponseEntity.ok(productsByCategory);
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no products available for the category"+category);
//    }

    @GetMapping("/sorted-by-price")
    public ResponseEntity<List<Products>> getProductsSortedByPrice(
            @RequestParam(defaultValue = "asc") String sortOrder) {

        List<Products> products;
        if (sortOrder.equalsIgnoreCase("asc")) {
            products = productsService.getProductsSortedByPriceAsc();
        } else if (sortOrder.equalsIgnoreCase("desc")) {
            products = productsService.getProductsSortedByPriceDesc();
        } else {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        return ResponseEntity.ok(products);
    }

}
