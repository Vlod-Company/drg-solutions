#!/bin/sh

BASE_DIR="$(pwd)"

for name in "$BASE_DIR"/*; do
    if [ -d "$name" ]; then
        dir_name=$(basename "$name")

        case "$dir_name" in
            *-service)
                echo ""
                echo "=== Building $dir_name ==="

                (
                    cd "$name" || exit 1
                    mvn clean package -DskipTests -Dmaven.compiler.compilerArgs="-Xlint:all -Werror"
                )

                if [ $? -ne 0 ]; then
                    break
                fi
                ;;
        esac
    fi
done
