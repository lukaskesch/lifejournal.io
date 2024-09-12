#!/bin/bash

# Get current date and time
current_datetime=$(date +"%Y-%m-%d_%H:%M:%S")

# Set the filename with the current datetime
dump_dir="$HOME/mysql"
dump_filename="mysql_dump_focus_journal_${current_datetime}.sql"
full_path="${dump_dir}/${dump_filename}"


mysqldump -<your-db-password> productivity_journal > "$full_path"

gzip -9k "$full_path"

rm "$full_path"

gzipped_path="${full_path}.gz"

aws s3 cp "$gzipped_path" s3://<your-s3-bucket-name>

mv "$gzipped_path" "${dump_dir}/dump.sql.gz"
