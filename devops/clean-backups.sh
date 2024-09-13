#!/bin/bash

# 0 23 * * * /path/to/your/clean-backups.sh >> /var/log/cron/info.log 2>> /var/log/cron/error.log

# S3 bucket name
S3_BUCKET="<your-s3-bucket-name>"

# Backup prefix in S3
BACKUP_PREFIX="backups/"

# Get current timestamp
CURRENT_TIME=$(date +%s)

# Get current date in YYYY-MM-DD format
CURRENT_DATE=$(date +%Y-%m-%d)

# Function to delete a file from S3
delete_file() {
    local file="$1"
    aws s3 rm "s3://$S3_BUCKET/$file"
}

echo "Starting backup cleanup"

# List all backup files
BACKUP_FILES=$(aws s3 ls "s3://$S3_BUCKET/$BACKUP_PREFIX" --recursive | awk '{print $4}')

# Process each backup file
for file in $BACKUP_FILES; do
    # Extract date from filename (format: YYYY-MM-DD_HH-mm-ss.sql.gz)
    filename=$(basename "$file")
    file_date="${filename:0:10}"
    
    # Calculate age in days
    age_days=$(( ($(date -d "$CURRENT_DATE" +%s) - $(date -d "$file_date" +%s)) / 86400 ))
    
    # Apply retention policy
    if [ $age_days -le 1 ]; then
        # Keep all backups for the last day
        echo "Keeping backup: $file"
        continue
    elif [ $age_days -le 7 ]; then
        # Keep daily backups for the last week
        if [ "${filename:11:2}" != "00" ]; then
            echo "Deleting backup: $file"
            delete_file "$file"
        else
            echo "Keeping backup: $file"
        fi
    elif [ $age_days -le 30 ]; then
        # Keep weekly backups for the last month
        week_number=$(date -d "$file_date" +%U)
        day_of_week=$(date -d "$file_date" +%u)
        
        # Keep only Sunday's backup (assuming Sunday is the start of the week)
        if [ "$day_of_week" != "7" ] || [ "${filename:11:2}" != "00" ]; then
            echo "Deleting backup: $file"
            delete_file "$file"
        else
            echo "Keeping backup: $file"
        fi
    else
        # Keep monthly backups for older periods
        if [ "${filename:8:2}" != "01" ] || [ "${filename:11:2}" != "00" ]; then
            echo "Deleting backup: $file"
            delete_file "$file"
        else
            echo "Keeping backup: $file"
        fi
    fi
done

echo "Backup cleanup completed."
