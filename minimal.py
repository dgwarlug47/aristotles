"""
Minimal DynamoDB Example
Requires: AWS credentials in ~/.aws/credentials
"""
import boto3
from botocore.exceptions import NoCredentialsError

try:
    # 1. Connect
    db = boto3.resource('dynamodb', region_name='us-east-1')
    table = db.Table('People')

    # 2. Write
    table.put_item(Item={
        'ID': '001', 
        'name': 'Hamlet', 
        'flaw': 'indecision'
    })
    print("✅ Character added to DynamoDB")

    # 3. Read  
    item = table.get_item(Key={'ID': '001'})['Item']
    print(f"📖 {item['name']}'s flaw is {item['flaw']}")

except NoCredentialsError:
    print("❌ AWS credentials not found!")
    print("To fix this:")
    print("1. Install AWS CLI: brew install awscli")
    print("2. Configure credentials: aws configure")
    print("3. Enter your Access Key ID and Secret Access Key")

except Exception as e:
    if "does not exist" in str(e):
        print("❌ Table 'my-characters' doesn't exist")
        print("Create it in AWS Console or use a different table name")
    else:
        print(f"❌ Error: {e}")
