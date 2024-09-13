#!/bin/bash

# Add this file to your crontab (crontab -e) to run it periodically
# Example: 0 * * * * /path/to/backup.sh >> /var/log/cron/info.log 2>> /var/log/cron/error.log

echo "Starting db backup"

# Get current date and time
current_datetime=$(date +"%Y-%m-%d_%H:%M:%S")

# Set the filename with the current datetime
dump_dir="$HOME/mysql-dumps"
dump_filename="mysql_dump_focus_journal_${current_datetime}.sql"
full_path="${dump_dir}/${dump_filename}"


# Run mysqldump and capture its exit status
mysqldump -p<your-db-password> productivity_journal > "$full_path"
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
aws s3 cp "$gzipped_path" s3://<your-s3-bucket-name>/some/path/
s3_status=$?

# Check if S3 upload was successful
if [ $s3_status -ne 0 ]; then
    echo "Error: AWS S3 upload failed with exit status $s3_status" >> /dev/stderr
    exit 1
fi

mv "$gzipped_path" "${dump_dir}/dump.sql.gz"


echo "Backup completed successfully"