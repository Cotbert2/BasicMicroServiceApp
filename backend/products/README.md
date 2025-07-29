# Categories Microservice

A Spring Boot REST API microservice for managing product categories.

## Features

- Complete CRUD operations for categories
- RESTful API endpoints
- Data validation with Bean Validation
- Automatic timestamp tracking
- JPA/Hibernate integration
- H2 in-memory database (default)

## Entity Structure

### Category
- **id**: Long - Auto-generated primary key
- **name**: String - Required, unique, 3-50 characters
- **description**: String - Optional, max 255 characters  
- **creationDate**: LocalDateTime - Automatically set on creation

## API Endpoints

### Base URL: `/api/categories`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/{id}` | Update existing category |
| DELETE | `/api/categories/{id}` | Delete category |

## Request/Response Examples

### Create Category
```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### Update Category
```bash
PUT /api/categories/1
Content-Type: application/json

{
  "name": "Updated Electronics",
  "description": "Updated description for electronics category"
}
```

### Get All Categories
```bash
GET /api/categories
```

Response:
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "creationDate": "2025-07-25T10:30:00"
  }
]
```

## Validation Rules

- **Name**: Required, unique, between 3-50 characters
- **Description**: Optional, maximum 255 characters
- **Creation Date**: Automatically managed, cannot be modified

## Technology Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Bean Validation**
- **H2 Database** (development)
- **Maven** (build tool)

## Project Structure

```
src/main/java/com/example/products/
├── controllers/
│   └── CategoryController.java
├── models/entities/
│   └── Category.java
├── repositories/
│   └── CategoryRepository.java
├── services/
│   ├── CategoryService.java
│   └── CategoryServiceImpl.java
└── ProductsApplication.java
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get all categories
curl -X GET http://localhost:8080/api/categories

# Create a new category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Books","description":"Books and literature"}'

# Get category by ID
curl -X GET http://localhost:8080/api/categories/1

# Update category
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Books","description":"Updated description"}'

# Delete category
curl -X DELETE http://localhost:8080/api/categories/1
```

## Database Configuration

By default, the application uses H2 in-memory database. To view the database console:

1. Navigate to `http://localhost:8080/h2-console`
2. Use JDBC URL: `jdbc:h2:mem:testdb`
3. Username: `sa`
4. Password: (leave empty)

## Error Handling

The API returns appropriate HTTP status codes:

- **200 OK**: Successful GET, PUT operations
- **201 Created**: Successful POST operations
- **204 No Content**: Successful DELETE operations
- **404 Not Found**: Category not found
- **400 Bad Request**: Validation errors



# Docker: 

to run docker pull th following image
```bash
docker pull cotbert2/categories-spring
docker run -dit -p 8085:8085 --name spring-categoires --network test-network -e DB_HOST=mysql-test:3306 categories-spring
```


Make sure that u have a MySQL container running with the name `mysql-test` and the database is accessible at port 3306.



