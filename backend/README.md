# Backend – Faite Assessment (Full-Stack)

This is the backend for the Faite Full-Stack Assessment built using **Spring Boot** and **MySQL**.

---

## ⚙️ Technologies Used

- Java 21
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Maven

---

## 📁 Project Structure

backend/
┣ src/
┣ pom.xml
┗ README.md

yaml
Copy code

---

## 🛠️ Prerequisites

Make sure you have these installed:

- Java JDK 21 or higher
- Maven
- MySQL Server (or XAMPP)

---

## 🗄️ Database Setup (MySQL)

1. Open MySQL
2. Create a new database:

```sql
CREATE DATABASE faite_assessment;
You do NOT need to create tables manually.
Spring Boot will generate them automatically.

🔧 Configure Database Connection
Open this file:

css
Copy code
src/main/resources/application.properties
Update it like this:

properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/faite_assessment
spring.datasource.username=root
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

server.port=8080
▶️ How to Run the Backend
Open terminal inside the backend folder and run:

Windows
bash
Copy code
mvnw spring-boot:run
Mac/Linux
bash
Copy code
./mvnw spring-boot:run
Or using Maven:

bash
Copy code
mvn spring-boot:run
✅ When backend runs successfully
You will see:

nginx
Copy code
Tomcat started on port 8080
Your backend will run at:

arduino
Copy code
http://localhost:8080
🧪 Test APIs using Postman
Example requests:

Register User
bash
Copy code
POST http://localhost:8080/api/auth/register
Content-Type: application/json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
Login
bash
Copy code
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "123456"
}
🔐 JWT Usage
After login, backend returns a token.

Send it in headers like:

makefile
Copy code
Authorization: Bearer YOUR_TOKEN
for protected APIs.

📌 Admin Access
To make an admin manually:

sql
Copy code
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
✅ Completed Features
User Registration

Login (JWT Authentication)

Profile Update

Change Password

Activity Logs

Admin Panel APIs


