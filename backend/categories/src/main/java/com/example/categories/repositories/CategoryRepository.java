package com.example.categories.repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.categories.models.entities.Category;

public interface CategoryRepository extends CrudRepository<Category,Long> {

}
