package com.example.products.services;

import com.example.products.models.entities.Product;
import com.example.products.repositories.ProductRepository;
import com.example.products.services.interfaces.IProductService;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService implements IProductService{

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return (List<Product>) productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        if(!productRepository.findById(id).isPresent()){
            throw new IllegalArgumentException("Product with id " + id + " does not exist");
        }
        product.setId(id);
        return productRepository.save(product);
    }

    @Override
    public Product patchProduct(Long id, Product product) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (!existingProductOpt.isPresent()) {
            throw new IllegalArgumentException("Product with id " + id + " does not exist");
        }
        
        Product existingProduct = existingProductOpt.get();
        
        // Solo actualizar campos que no son nulos
        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null) {
            existingProduct.setPrice(product.getPrice());
        }
        
        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        if(!productRepository.findById(id).isPresent()){
            throw new IllegalArgumentException("Product with id " + id + " does not exist");
        }
        productRepository.deleteById(id);
    }
}