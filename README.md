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
* Spring Test
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

## 6. Тестирование

### 6.1 Стратегия тестирования

Проект включает комплексное тестовое покрытие для всех микросервисов:

* **Unit тесты** - тестирование бизнес-логики сервисов (Mockito)
* **Контроллер тесты** - тестирование REST API endpoints (MockMvc)
* **Интеграционные тесты** - тестирование полного процесса с БД (H2 для тестов, PostgreSQL для production)

### 6.2 Запуск тестов

Для запуска тестов конкретного сервиса:

```bash
cd <service-name>
mvn clean test
```

Для запуска всех тестов в проекте:

```bash
mvn clean test  # из корня каждого сервиса
```

### 6.3 Структура тестов

Каждый сервис содержит в директории `src/test/java/vvp_company/<servicename>/`:

* `*ServiceUnitTest.java` - unit тесты для service layer
* `*ControllerTest.java` - тесты REST контроллеров
* `*ServiceIntegrationTest.java` - интеграционные тесты

Конфигурация для тестов: `src/test/resources/application-test.properties`

Пример для employee-service:
- `EmployeeServiceUnitTest.java` - unit тесты сервиса (CRUD операции, исключения)
- `EmployeeControllerTest.java` - тесты HTTP endpoints
- `EmployeeServiceIntegrationTest.java` - полные тесты с БД (CRUD flow, валидация, edge cases)

---

## 7. Frontend
Разработанно + работает
Скрины позже


## 8. Заключение

Вот такая вот система, прикольные технологии :)

---

