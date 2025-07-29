package com.example.products.repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.products.models.entities.Product;

public interface ProductRepository extends CrudRepository<Product,Long> {

}
