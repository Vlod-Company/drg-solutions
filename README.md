## Структура
Все сервисы обязаны предерживаться следующей структуры
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
