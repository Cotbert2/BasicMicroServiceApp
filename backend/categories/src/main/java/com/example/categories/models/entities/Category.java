package com.example.categories.models.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 3, message = "The name must have at least 3 characters")
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    @NotBlank(message = "Description cannot be blank")
    private String description;

    @CreationTimestamp
    @Column(name = "creation_date", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Category() {
    }

    public Category(String name) {
        this.name = name;
    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
