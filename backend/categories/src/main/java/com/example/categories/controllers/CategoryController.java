package com.example.categories.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.categories.models.entities.Category;
import com.example.categories.services.interfaces.ICategoryService;

import jakarta.validation.Valid;

import java.util.List;

@RestController()
@RequestMapping("/api/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    public CategoryController(ICategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id){
        return categoryService.getCategoryById(id).map(ResponseEntity::ok).
                orElse(ResponseEntity.notFound().build());

    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category category){
        try{
            return ResponseEntity.ok(categoryService.updateCategory(id, category));
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Category> patchCategory(@PathVariable Long id, @RequestBody Category category){
        try{
            return ResponseEntity.ok(categoryService.patchCategory(id, category));
        }catch(RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
