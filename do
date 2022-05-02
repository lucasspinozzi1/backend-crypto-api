#!/bin/sh
case "$1" in
  "mysql")
    case "$2" in
      "build")
        docker build --tag omni-mysql-crypto -f docker/mysql/Dockerfile --no-cache "${@:3}" .
        ;;
      "run")
        # allow mysql bind port by parameter
        docker run -d -p ${3:-3306}:3306 --name omni-mysql-crypto -e MYSQL_ROOT_PASSWORD=rootpass omni-mysql-crypto
        ;;
      "start")
        docker start omni-mysql-crypto
        ;;
      "stop")
        docker stop omni-mysql-crypto
        ;;
      "remove")
        docker rm omni-mysql-crypto
        ;;
      "logs")
        docker logs omni-mysql-crypto --follow
        ;;
      "workbench")
        docker run -d \
          --name omni-mysql-crypto-phpmyadmin \
          --link omni-mysql-crypto:db \
          -p ${3:-80}:80 \
          phpmyadmin
        ;;
      *)
        echo "options:"
        echo "  build"
        echo "  run [:port]"
        echo "  start"
        echo "  stop"
        echo "  remove"
        echo "  logs"
        echo "  workbench [:port]"
        echo "connect command:"
        echo "  mysql -u dbuser -P 3306 -p -h 0.0.0.0 crypto"
        echo "  enter \"dbpass\""
        exit 0
        ;;
    esac
    ;;
  "app")
    case "$2" in
      "build")
        docker build --tag omni-crypto -f docker/app/Dockerfile . 
        ;;
      "run")
        docker run -d --name omni-crypto \
          -p ${3:-3000}:3000 \
          -e PORT=3000 \
          -e DB_HOST=${DB_HOST} \
          -e DB_PORT=${DB_PORT} \
          -e DB_USERNAME=${DB_USERNAME} \
          -e DB_PASSWORD=${DB_PASSWORD} \
          -e DB_NAME=${DB_NAME} \
          omni-crypto
        ;;
      "ephemeral")
        docker run --rm --name omni-crypto \
          -p ${3:-3000}:3000 \
          -e PORT=3000 \
          -e DB_HOST=${DB_HOST} \
          -e DB_PORT=${DB_PORT} \
          -e DB_USERNAME=${DB_USERNAME} \
          -e DB_PASSWORD=${DB_PASSWORD} \
          -e DB_NAME=${DB_NAME} \
          omni-crypto
        ;;
      "start")
        docker start omni-crypto
        ;;
      "stop")
        docker stop omni-crypto
        ;;
      "remove")
        docker rm omni-crypto
        ;;
      "logs")
        docker logs omni-crypto --follow
        ;;
      *)
        echo "options:"
        echo "  build"
        echo "  run [:port]"
        echo "  ephemeral"
        echo "  start"
        echo "  stop"
        echo "  remove"
        echo "  logs"
        echo "    for 'run' or 'ephemeral' it is posible to set env variables before execution"
        echo "    DB_HOST=\`hostname -I | awk '{print \$1}'\` ./do dev ephemeral"
        exit 0
        ;;
    esac
    ;;
  *)
    echo "options:"
    echo "  mysql"
    echo "  app"
esac

