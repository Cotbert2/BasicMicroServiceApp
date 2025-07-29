package com.example.categories.services.interfaces;

import java.util.List;
import java.util.Optional;

import com.example.categories.models.entities.Category;

public interface ICategoryService {

    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Long id);
    Category createCategory(Category category);
    Category updateCategory(Long id, Category category);
    void deleteCategory(Long id);
}
