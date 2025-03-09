#!/bin/bash

# Usage: ./mysql-backup.sh <db_name> <db_password> <dump_dir> <s3_bucket_name> <s3_path> 

# Check if all required arguments are provided
if [ $# -ne 5 ]; then
    echo "Usage: $0 <db_name> <db_password> <dump_dir> <s3_bucket_name> <s3_path>" >&2
    exit 1
fi

# Assign command-line arguments to variables
db_name="$1"
db_password="$2"
dump_dir="$3"
s3_bucket_name="$4"
s3_path="$5"

echo "Starting db backup"

# Get current date and time
current_datetime=$(date +"%Y-%m-%d_%H:%M:%S")

# Set the filename with the current datetime
dump_filename="${current_datetime}.sql"
full_path="${dump_dir}/${dump_filename}"


# Run mysqldump and capture its exit status
mysqldump -p"$db_password" --all-databases > "$full_path"
dump_status=$?

# Check if mysqldump was successful
if [ $dump_status -ne 0 ]; then
    echo "Error: mysqldump failed with exit status $dump_status" >> /dev/stderr
    exit 1
fi

gzip -9k "$full_path"

rm "$full_path"

gzipped_path="${full_path}.gz"

# Upload to S3 and capture its exit status
aws s3 cp "$gzipped_path" "s3://${s3_bucket_name}/${s3_path}/"
s3_status=$?

# Check if S3 upload was successful
if [ $s3_status -ne 0 ]; then
    echo "Error: AWS S3 upload failed with exit status $s3_status" >> /dev/stderr
    exit 1
fi

mv "$gzipped_path" "${dump_dir}/dump.sql.gz"


echo "Backup completed successfully"