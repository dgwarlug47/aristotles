# Aristotelian Character Analyzer AI

This module uses OpenAI's GPT models to analyze characters through an Aristotelian philosophical lens, automatically generating character data including hamartia (tragic flaw), phronesis (practical wisdom), telos (purpose), and more.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd src/AI
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in the AI directory:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run the Analyzer

```bash
# Test the analyzer
npm test

# Run the main example
npm run dev
```

## 🎯 Features

### **Character Analysis**
Analyzes any character (fictional or historical) and generates:
- **Hamartia**: Tragic flaw or fundamental character error
- **Context**: Where the flaw causes the most problems
- **Phronesis Level**: Practical wisdom (low/medium/high)
- **Phronesis Trajectory**: How wisdom changes (increasing/decreasing/constant)
- **Telos**: Ultimate purpose or goal
- **Greatest Win**: Specific victory where traits served them well
- **Greatest Defeat**: Specific failure caused by their hamartia
- **Tags**: Categorization tags
- **Image**: Suggested filename for character image

### **Batch Analysis**
- Analyze multiple characters at once
- Automatic rate limiting to respect API limits
- Error handling for failed analyses

### **Character Suggestions**
- Get character suggestions based on themes
- Perfect for discovering new characters to analyze

## 📊 Usage Examples

### **Single Character Analysis**

```typescript
import CharacterAnalyzer from './character-analyzer';

const analyzer = new CharacterAnalyzer();
const character = await analyzer.analyzeCharacter('Hamlet');

console.log(character.hamartia); // "indecision"
console.log(character.telos);    // "Restore justice to Denmark"
```

### **Batch Analysis**

```typescript
const characters = await analyzer.analyzeCharacters([
  'Macbeth', 'Lady Macbeth', 'King Lear'
]);

characters.forEach(char => {
  console.log(`${char.characterName}: ${char.hamartia}`);
});
```

### **Get Suggestions**

```typescript
const suggestions = await analyzer.getCharacterSuggestions('Greek mythology', 5);
console.log(suggestions); // ['Achilles', 'Antigone', 'Oedipus', ...]
```

### **Integration with Database**

```typescript
import CharacterDB from '../DB/dynamodb';

const analyzer = new CharacterAnalyzer();
const db = new CharacterDB();

// Generate character data with AI
const character = await analyzer.analyzeCharacter('Othello');

// Save to DynamoDB
await db.putCharacter(character);
```

## 🔧 Configuration

### **API Key Options**

1. **Environment Variable** (recommended):
   ```bash
   export OPENAI_API_KEY=sk-your-key-here
   ```

2. **Constructor Parameter**:
   ```typescript
   const analyzer = new CharacterAnalyzer('sk-your-key-here');
   ```

3. **Environment File**:
   Create `.env` file with `OPENAI_API_KEY=sk-your-key-here`

### **Model Configuration**

The analyzer uses `gpt-4o-mini` by default for cost-effectiveness. You can modify the model in the `character-analyzer.ts` file.

## 📝 Character Schema

Generated characters match the Aristotelian Character interface:

```typescript
interface Character {
    characterName: string;       // Primary key
    hamartia: string;           // Tragic flaw
    context: string;            // Context where flaw manifests
    phronesisLevel: string;     // Wisdom level
    phronesisTrajectory: string; // Wisdom trajectory
    telos: string;              // Purpose/goal
    greatestWin: string;        // Greatest victory
    greatestDefeat: string;     // Greatest defeat
    tags: string[];             // Categorization tags
    image: string;              // Image filename
}
```

## 🛠️ Error Handling

The analyzer includes comprehensive error handling:
- **API failures**: Returns fallback character with error information
- **Invalid responses**: Validates and structures AI responses
- **Rate limiting**: Automatic delays in batch operations
- **Network issues**: Graceful degradation

## 💡 Use Cases

1. **Research Tool**: Quickly generate philosophical analysis of literary characters
2. **Educational Content**: Create character studies for literature classes
3. **Database Population**: Bulk generate character data for applications
4. **Character Discovery**: Find new characters based on themes
5. **Comparative Analysis**: Batch analyze characters for comparison

## 🚨 Important Notes

- **API Costs**: OpenAI API usage incurs costs. Monitor your usage.
- **Rate Limits**: The API has rate limits. Batch operations include delays.
- **Data Quality**: AI-generated content should be reviewed for accuracy.
- **API Key Security**: Never commit API keys to version control.

## 📋 Available Scripts

- `npm run dev` - Run the character analyzer example
- `npm test` - Run comprehensive tests
- `npm run build` - Compile TypeScript to JavaScript

## 🔗 Integration

This module integrates seamlessly with:
- **Database Module** (`../DB/`) - Save generated characters
- **Character Model** (`../Models/character.ts`) - Type-safe character data
- **Web Interface** - Use in frontend applications
- **Batch Processing** - Analyze multiple characters efficiently
