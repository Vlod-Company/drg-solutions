#!/bin/bash

set -e

TOMCAT_PATH="$HOME/Desktop/tomcat"

REGISTRY_PORT=1390
GATEWAY_PORT=1391
TOMCAT_PORT=1392

required_vars=(
  SPRING_DATASOURCE_URL
  SPRING_DATASOURCE_USERNAME
  SPRING_DATASOURCE_PASSWORD
  EUREKA_SERVER
  JWT_SECRET
  AUTH_PEPPER
  JWT_EXPIRATION_MS
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Не задан $var"
    exit 1
  fi
done

run_jar() {
  exec java -jar "$2" --server.port="$1" > log 2>&1 &
}

echo "Очистка tomcat/webapps..."
rm -rf "$TOMCAT_PATH"/webapps/*

gateway="gateway-service/target/gateway.jar"
registry="registry-service/target/registry.jar"
wars=( *-service/target/*.war )

echo "Копирование WAR..."
for war in "${wars[@]}"; do
  cp "$war"  "$TOMCAT_PATH"/webapps/
done

echo "Запуск JAR..."
run_jar $GATEWAY_PORT "$gateway"
run_jar $REGISTRY_PORT "$registry"

echo "Запуск Tomcat..."
sh "$TOMCAT_PATH"/bin/catalina.sh start


echo "Деплой завершён"
