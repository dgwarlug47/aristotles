#!/usr/bin/env python3
"""
Simple DynamoDB read/write example.
Assumes AWS credentials are configured in ~/.aws/
"""

import boto3
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table_name = 'characters'
table = dynamodb.Table(table_name)

def write_character(character_id, name, hamartia, context, phronesis):
    """Write a character to DynamoDB"""
    try:
        response = table.put_item(
            Item={
                'character_id': character_id,
                'name': name,
                'hamartia': hamartia,
                'context': context,
                'phronesis': phronesis
            }
        )
        print(f"✅ Added character: {name}")
        return response
    except Exception as e:
        print(f"❌ Error adding character: {e}")
        return None

def read_character(character_id):
    """Read a character from DynamoDB"""
    try:
        response = table.get_item(
            Key={
                'character_id': character_id
            }
        )
        item = response.get('Item')
        if item:
            print(f"📖 Found character: {item['name']}")
            return item
        else:
            print(f"❌ Character {character_id} not found")
            return None
    except Exception as e:
        print(f"❌ Error reading character: {e}")
        return None

def list_all_characters():
    """List all characters in the table"""
    try:
        response = table.scan()
        items = response.get('Items', [])
        print(f"📋 Found {len(items)} characters:")
        for item in items:
            print(f"  - {item['name']} ({item['character_id']})")
        return items
    except Exception as e:
        print(f"❌ Error listing characters: {e}")
        return []

# Example usage
if __name__ == "__main__":
    print("🔷 Simple DynamoDB Example")
    print("-" * 30)
    
    # Write some characters
    write_character(
        character_id="hamlet", 
        name="Hamlet", 
        hamartia="indecision", 
        context="royal court", 
        phronesis="medium"
    )
    
    write_character(
        character_id="macbeth", 
        name="Macbeth", 
        hamartia="ambition", 
        context="political power", 
        phronesis="low"
    )
    
    # Read a character
    hamlet = read_character("hamlet")
    if hamlet:
        print(f"Hamlet's hamartia: {hamlet['hamartia']}")
    
    # List all characters
    print("\n📋 All characters:")
    list_all_characters()
