# Aristotelian Character Database

A comprehensive system for analyzing literary and historical characters through Aristotelian philosophy, featuring DynamoDB backend and TypeScript frontend.

## 🚀 Quick Start - Running the Application

### 1. Run the Frontend (TypeScript UI) ✅
```bash
# Navigate to the src folder
cd src

# Compile TypeScript (if you made changes)
tsc main.ts --target ES2020

# Open the application in your browser
open index.html
# OR on Linux: xdg-open index.html
# OR manually open: file:///Users/davi/Desktop/Code/aristotles/src/index.html
```

**What you'll see:**
- 🏛️ Greek-styled interface with classical design
- 📊 Dynamic character table showing Macbeth's data (last character added)
- 🖼️ Character image that updates based on the data
- 🎭 Interactive text blocks with philosophical content

### 2. Run the Python Backend (DynamoDB) ✅
```bash
# Configure AWS credentials first
aws configure

# Run the minimal DynamoDB example
python minimal.py

# Or run more comprehensive examples
python examples.py
```

### 3. Development Workflow
```bash
# If you modify TypeScript code:
cd src
tsc main.ts --target ES2020
# Then refresh your browser

# If you modify Python code:
python your_modified_file.py

# Check browser console (F12) for debug info
```

**Current Status:** ✅ **Both frontend and backend are working correctly!**

---

## Features

- 🏛️ **Greek Classical UI**: Beautiful Aristotelian-themed interface
- 📊 **Dynamic Character Display**: TypeScript-powered character data visualization
- 🔧 **Easy Setup**: Simple configuration and connection management
- 📝 **CRUD Operations**: Create, Read, Update, Delete items in DynamoDB
- 📊 **Batch Operations**: Efficient batch writing for multiple items
- 🔍 **Query & Scan**: Powerful querying and scanning capabilities
- 🛡️ **Error Handling**: Comprehensive error handling and logging
- 📚 **Real-world Examples**: Character management with philosophical analysis
- 🔄 **Type Conversion**: Automatic handling of DynamoDB data types

## AWS DynamoDB Backend

### Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Configure AWS credentials (choose one method):

## AWS Credentials File
Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your_access_key_id
aws_secret_access_key = your_secret_access_key
```

Create `~/.aws/config`:
```ini
[default]
region = us-east-1
output = json
```

## Quick Start

### Basic Usage

```python
from database import DynamoDBManager

# Initialize the manager
db = DynamoDBManager(table_name='my_table')

# Write an item
item = {
    'id': 'user123',
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30
}
db.put_item(item)

# Read an item
user = db.get_item({'id': 'user123'})
print(user)

# Query items
users = db.query_items('id', 'user123')

# Update an item
db.update_item(
    key={'id': 'user123'},
    update_expression='SET age = :age',
    expression_attribute_values={':age': 31}
)

# Delete an item
db.delete_item({'id': 'user123'})
```

### Creating a Table

```python
# Create a table with partition key only
db.create_table('user_id')

# Create a table with partition key and sort key
db.create_table('user_id', 'timestamp')
```

### Batch Operations

```python
# Batch write multiple items
items = [
    {'id': 'user1', 'name': 'Alice'},
    {'id': 'user2', 'name': 'Bob'},
    {'id': 'user3', 'name': 'Charlie'}
]
db.batch_write_items(items)
```

### Advanced Querying

```python
from boto3.dynamodb.conditions import Key, Attr

# Query with sort key condition
users = db.query_items(
    partition_key_name='user_id',
    partition_key_value='user123',
    sort_key_name='timestamp',
    sort_key_condition=Key('timestamp').begins_with('2025-08')
)

# Scan with filters
active_users = db.scan_items(
    filter_expression=Attr('active').eq(True) & Attr('age').gte(18),
    limit=50
)
```

## File Structure

- `database.py` - Main DynamoDB manager class
- `aws_config.py` - AWS configuration helper and credential checker
- `examples.py` - Real-world usage examples
- `requirements.txt` - Python dependencies

## Examples

### Check AWS Configuration

```bash
python aws_config.py
```

This will check your AWS credentials and list your DynamoDB tables.

### Run Examples

```bash
python examples.py
```

This demonstrates:
- User management system
- Product catalog
- Activity logging

### User Management Example

```python
from examples import UserManager

user_mgr = UserManager()

# Create user
user_id = user_mgr.create_user(
    email="john@example.com",
    name="John Doe",
    age=30
)

# Get user
user = user_mgr.get_user(user_id)

# Update user
user_mgr.update_user_profile(user_id, age=31, department="Engineering")
```

## Error Handling

The library includes comprehensive error handling:

```python
try:
    db.put_item(item)
except Exception as e:
    print(f"Error writing to DynamoDB: {str(e)}")
```

## Data Type Handling

The library automatically handles DynamoDB data type conversions:
- Python `float` ↔ DynamoDB `Decimal`
- Nested dictionaries and lists are supported
- Boolean, string, and number types work seamlessly

## Required AWS Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem", 
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:ListTables"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/*",
        "arn:aws:dynamodb:*:*:table/*/index/*"
      ]
    }
  ]
}
```

## Best Practices

1. **Table Design**: Design your partition and sort keys carefully for optimal performance
2. **Batch Operations**: Use batch operations for multiple items to reduce API calls
3. **Error Handling**: Always wrap DynamoDB operations in try-catch blocks
4. **Pagination**: Use pagination for large result sets
5. **Cost Optimization**: Use scan operations sparingly; prefer query operations
6. **Security**: Use IAM roles and policies to control access

## Testing

Before running in production, test your AWS configuration:

```bash
python aws_config.py
```

This will verify:
- ✅ AWS credentials are configured
- ✅ DynamoDB permissions work
- ✅ List existing tables

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.