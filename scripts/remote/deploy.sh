#!/bin/bash

set -e

USER="${SSH_USER}"
HOST="host"
REMOTE_SCP_PATH="tmp"

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
  SSH_USER
  SSH_PASSWORD
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Не задан $var"
    exit 1
  fi
done

JAVA_OPTS="-Xms192m -Xmx192m -XX:MaxMetaspaceSize=128m -Xss256k \
-XX:MaxDirectMemorySize=64m -XX:+UseStringDeduplication"

# ===== Функции =====

ssh_cmd() {
  ssh -p 2222 -o StrictHostKeyChecking=no "$USER@$HOST" "$1"
}

scp_cmd() {
  scp -P 2222 -o StrictHostKeyChecking=no "$1" "$USER@$HOST:$2"
}

build_env() {
  local port=$1
  echo "
    unset _JAVA_OPTIONS
    export SPRING_DATASOURCE_URL=\"$SPRING_DATASOURCE_URL\"
    export SPRING_DATASOURCE_USERNAME=\"$SPRING_DATASOURCE_USERNAME\"
    export SPRING_DATASOURCE_PASSWORD=\"$SPRING_DATASOURCE_PASSWORD\"
    export EUREKA_SERVER=\"$EUREKA_SERVER\"
    export JWT_SECRET=\"$JWT_SECRET\"
    export AUTH_PEPPER=\"$AUTH_PEPPER\"
    export JWT_EXPIRATION_MS=\"$JWT_EXPIRATION_MS\"
    export JAVA_OPTS=\"$JAVA_OPTS\"
    export SERVER_PORT=\"$port\"
  "
}

run_jar() {
  local port=$1
  local jar_file=$2
  local filename=$(basename "$jar_file")

  local remote_cmd="
    $(build_env "$port")
    nohup java \$JAVA_OPTS -jar $REMOTE_SCP_PATH/$filename > /dev/null 2>&1 &
  "

  ssh_cmd "$remote_cmd"
}

echo "Очистка tomcat/webapps..."
ssh_cmd "rm -rf tomcat/webapps/*"

echo "Удаление старых JAR..."
ssh_cmd "rm -f $REMOTE_SCP_PATH/*.jar"

echo "Ожидание..."
ssh_cmd "sleep 1"

gateway="gateway-service/target/gateway.jar"
registry="registry-service/target/registry.jar"
wars=( *-service/target/*.war )

echo "Копирование JAR..."
scp_cmd "$gateway" "$REMOTE_SCP_PATH"
scp_cmd "$registry" "$REMOTE_SCP_PATH"

echo "Копирование WAR..."
for war in "${wars[@]:0:2}"; do
  scp_cmd "$war" "tomcat/webapps/"
done

echo "Запуск JAR..."
run_jar $GATEWAY_PORT "$gateway"
run_jar $REGISTRY_PORT "$registry"

echo "Запуск Tomcat..."
ssh_cmd "
$(build_env $TOMCAT_PORT)
tomcat/bin/catalina.sh start
"


echo "Деплой завершён"
