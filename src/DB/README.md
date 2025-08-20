# Aristotles DynamoDB TypeScript Implementation

This TypeScript implementation provide### **Basic Operations**
- `putCharacter(character: Character)` - Add a new character
- `getCharacter(characterName: string)` - Get character by character name
- `getAllCharacters()` - Get all characters
- `updateCharacter(characterName: string, updates: Partial<Character>)` - Update character
- `deleteCharacter(characterName: string)` - Delete charactermplete DynamoDB integration for managing Aristotelian character data, equivalent to the functionality in `minimal.py`.

## 🏗️ Project Structure

```
src/DB/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── dynamodb.ts           # Main CharacterDB class
├── table-creator.ts      # Utility to create DynamoDB table
├── simple-example.ts     # Simple example (equivalent to minimal.py)
└── README.md            # This file
```

*Note: Character interface is imported from `../Models/character.ts`*

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd src/DB
npm install
```

### 2. Configure AWS Credentials

Make sure you have AWS credentials configured:

```bash
# Install AWS CLI if not already installed
brew install awscli

# Configure your credentials
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (e.g., `json`)

### 3. Create the DynamoDB Table

```bash
# Create the table in AWS
npm run create-table
```

### 4. Run the Example

```bash
# Run the main example (similar to minimal.py)
npm run dev
```

## 📝 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled JavaScript
- `npm run dev` - Run TypeScript directly with ts-node
- `npm run create-table` - Create the DynamoDB table

## 🎯 Character Schema

The Character interface matches the requirements with the following fields:

```typescript
interface Character {
    characterName: string;       // Primary key - character name
    hamartia: string;           // Tragic flaw
    context: string;            // Where the flaw causes problems
    phronesisLevel: string;     // Practical wisdom level
    phronesisTrajectory: string; // Wisdom trajectory
    telos: string;              // Purpose/goal
    greatestWin: string;        // Greatest victory
    greatestDefeat: string;     // Greatest defeat
    tags: string[];             // List of tags for categorization
    image: string;              // Image URL or path
}
```

## 🔧 CharacterDB Class Methods

### Basic Operations
- `putCharacter(character: Character)` - Add a new character
- `getCharacter(id: string)` - Get character by ID
- `getAllCharacters()` - Get all characters
- `updateCharacter(id: string, updates: Partial<Character>)` - Update character
- `deleteCharacter(characterName: string)` - Delete character

### Search Operations
- `getCharactersByHamartia(hamartia: string)` - Find by tragic flaw
- `getCharactersByPhronesisLevel(level: string)` - Find by wisdom level

## 📊 Example Usage

```typescript
import CharacterDB from './dynamodb';

async function example() {
    const db = new CharacterDB();
    
    // Create a character (similar to minimal.py)
    const hamlet: Character = {
        characterName: 'Hamlet',
        hamartia: 'indecision',
        context: 'Danish prince seeking revenge',
        phronesisLevel: 'high',
        phronesisTrajectory: 'decreasing',
        telos: 'Restore justice to Denmark',
        greatestWin: 'Successfully exposed Claudius\'s guilt',
        greatestDefeat: 'His indecision led to multiple deaths',
        tags: ['tragedy', 'revenge', 'royalty'],
        image: 'hamlet.jpg'
    };
    
    // Add to database
    await db.putCharacter(hamlet);
    
    // Retrieve from database
    const character = await db.getCharacter('Hamlet');
    console.log(`${character?.characterName}'s hamartia is ${character?.hamartia}`);
}
```

## 🔍 Comparison with minimal.py

| Feature | minimal.py | TypeScript Implementation |
|---------|------------|---------------------------|
| Connect | `boto3.resource('dynamodb')` | `new CharacterDB()` |
| Write | `table.put_item(Item={...})` | `await db.putCharacter(character)` |
| Read | `table.get_item(Key={...})` | `await db.getCharacter(id)` |
| Error Handling | Try/except with boto3 errors | Try/catch with AWS SDK v3 errors |
| Type Safety | None | Full TypeScript typing |

## ⚡ Advanced Features

The TypeScript implementation extends beyond minimal.py with:

- **Type Safety**: Full TypeScript interfaces and type checking
- **Advanced Queries**: Search by hamartia, phronesis, etc.
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Error Handling**: Comprehensive error handling with informative messages
- **Table Management**: Automated table creation and management
- **Modern AWS SDK**: Uses AWS SDK v3 with modern async/await patterns

## 🛠️ Troubleshooting

### Common Issues

1. **"Table does not exist"**
   ```bash
   npm run create-table
   ```

2. **"AWS credentials not found"**
   ```bash
   aws configure
   ```

3. **TypeScript compilation errors**
   ```bash
   npm install
   npm run build
   ```

### Development Tips

- Use `npm run dev` for development (auto-compilation)
- Check AWS Console to verify table creation
- Monitor costs in AWS Billing (using PAY_PER_REQUEST mode)
- Use AWS CloudWatch for monitoring table metrics

## 📋 Requirements

- Node.js 16+
- TypeScript 5+
- AWS Account with DynamoDB access
- AWS CLI configured with appropriate permissions

## 🔐 Required AWS Permissions

Your AWS user/role needs these DynamoDB permissions:
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Scan`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`
