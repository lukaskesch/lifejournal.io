#!/bin/bash

# Find the MySQL container ID
CONTAINER_ID=$(docker ps | grep "db" | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
    echo "MySQL container is not running"
      exit 1
fi

echo "Found MySQL container with ID: $CONTAINER_ID"

MYSQL_DATABASE=$(docker exec $CONTAINER_ID env | grep MYSQL_DATABASE | cut -d= -f2)
MYSQL_ROOT_PASSWORD=$(docker exec $CONTAINER_ID env | grep MYSQL_ROOT_PASSWORD | cut -d= -f2)

echo "Connecting to MySQL database: $MYSQL_DATABASE"


# Connect to MySQL
docker exec -it $CONTAINER_ID mysql -u root -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE

# If the connection fails, try without bundling the password
if [ $? -ne 0 ]; then
    echo "Connection failed. Trying again without bundling the password."
    docker exec -it $CONTAINER_ID mysql -u root -p $MYSQL_DATABASE
fi
