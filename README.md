# Корпоративное приложение DRG Solutions
## Богоявленский Александр & Вайнштейн Владислав

## 1. Общая информация

**Название проекта:** DRG Solutions


**Описание:** Корпоративное приложение, построенное на микросервисной архитектуре для корпорации Deep Rock Galactic (из одноимённой игры)

**Цель проекта:** 
Создание масштабируемого, отказоустойчивого и расширяемого приложения для корпоративного использования на базе Spring Boot

---

## 2. Архитектура системы

### 2.1 Общая схема

* Микросервисная архитектура
* REST API + JSON
* Spring Cloud Service Discovery
* Spring Cloud MVC Gateway

### 2.2 Компоненты

* **API Gateway** (Spring Cloud MVC Gateway)
* **Service Discovery** (Eureka)
* **Auth Service** (Spring Security, JWT)
* **Business Services** (основная бизнес-логика)
* **Database** (PostgreSQL)

### 2.3 Схема приложения
<img width="3581" height="2801" alt="IS_FINAL (1)" src="https://github.com/user-attachments/assets/e662295e-4855-4d8f-9bc9-93d4b9c5d10c" />

---

## 3. Стек технологий

### Backend

* Java 17
* Spring Boot
* Spring Cloud
* Spring Data JPA
* Spring Security
* Spring Feign Client

---

## 4. Структура репозитория
Репозиторий разделён на самостоятельные микросервисы, каждый из который соответсвует следующей структуре (с правками в зависимости от сервиса)
```text
x-service/
└── src/
    └── main/
        └── java/
            └── vvp_company.xservice/
                ├── controller/
                │   └── здесь контроллеры
                ├── dto/
                │   └── дто для необходимых сущностей
                ├── exception/
                │   └── эксепшены
                ├── model/
                │   └── Энтити + используемые сущности
                ├── repository/
                │   └── репозиторий
                └── service/
                │   └── сервисы
                ├── RequestServiceApplication.java  # Точка входа (Spring Boot)
                └── ServletInitializer.java 
```

---

## 5. Хранение данных

* Единая БД на PostgreSQL
<img width="1607" height="814" alt="image" src="https://github.com/user-attachments/assets/8b02e77f-cefb-4a05-bcdd-6b0fcf86613c" />


---

## 6. Frontend
На данный момент в работе ...

---
## 7. Заключение

Вот такая вот система, прикольные технологии :)

