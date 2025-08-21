/**
 * AI + Database Integration Example
 * 
 * This example shows how to:
 * 1. Use AI to analyze a character
 * 2. Save the character to DynamoDB
 * 3. Retrieve and display the character
 */

import CharacterAnalyzer from './character-analyzer';
import CharacterDB from '../DB/dynamodb';

async function aiToDatabaseExample() {
  console.log('🤖 AI + Database Integration Example\n');
  
  try {
    // Initialize AI analyzer and database
    const analyzer = new CharacterAnalyzer();
    const db = new CharacterDB();
    
    // Step 1: Generate character data using AI
    console.log('Step 1: Analyzing character with AI...');
    const characterName = 'Julius Caesar';
    const character = await analyzer.analyzeCharacter(characterName);
    
    console.log(`✅ AI Analysis complete for ${character.characterName}`);
    console.log(`   Hamartia: ${character.hamartia}`);
    console.log(`   Telos: ${character.telos}`);
    
    // Step 2: Save to database
    console.log('\nStep 2: Saving to DynamoDB...');
    await db.putCharacter(character);
    console.log('✅ Character saved to database');
    
    // Step 3: Retrieve from database to verify
    console.log('\nStep 3: Retrieving from database...');
    const retrieved = await db.getCharacter(character.characterName);
    
    if (retrieved) {
      console.log('✅ Character successfully retrieved from database');
      console.log('\n📊 Complete Character Profile:');
      console.log('================================');
      console.log(`Name: ${retrieved.characterName}`);
      console.log(`Hamartia: ${retrieved.hamartia}`);
      console.log(`Context: ${retrieved.context}`);
      console.log(`Phronesis: ${retrieved.phronesisLevel} (${retrieved.phronesisTrajectory})`);
      console.log(`Telos: ${retrieved.telos}`);
      console.log(`Greatest Win: ${retrieved.greatestWin}`);
      console.log(`Greatest Defeat: ${retrieved.greatestDefeat}`);
      console.log(`Tags: ${retrieved.tags.join(', ')}`);
      console.log(`Image: ${retrieved.image}`);
    }
    
    console.log('\n🎉 Integration example completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration example failed:', error);
    
    if (error instanceof Error && error.message?.includes('credentials')) {
      console.log('\n💡 Make sure you have:');
      console.log('   1. OpenAI API key in .env file or environment variable');
      console.log('   2. AWS credentials configured for DynamoDB');
    }
  }
}

async function batchAnalysisExample() {
  console.log('\n🔄 Batch Analysis + Database Example\n');
  
  try {
    const analyzer = new CharacterAnalyzer();
    const db = new CharacterDB();
    
    // Get character suggestions first
    console.log('Getting character suggestions...');
    const suggestions = await analyzer.getCharacterSuggestions('tragic heroes', 3);
    console.log(`✅ Got suggestions: ${suggestions.join(', ')}`);
    
    // Analyze all suggested characters
    console.log('\nAnalyzing suggested characters...');
    const characters = await analyzer.analyzeCharacters(suggestions);
    
    // Save all to database
    console.log('\nSaving all characters to database...');
    for (const character of characters) {
      await db.putCharacter(character);
      console.log(`✅ Saved: ${character.characterName}`);
    }
    
    // Get all characters from database
    const allCharacters = await db.getAllCharacters();
    console.log(`\n📚 Total characters in database: ${allCharacters.length}`);
    
  } catch (error) {
    console.error('❌ Batch example failed:', error);
  }
}

// Main function to run examples
async function main() {
  console.log('🚀 Starting AI + Database Integration Examples\n');
  
  // Example 1: Single character AI → Database
  await aiToDatabaseExample();
  
  // Wait a bit between examples
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Example 2: Batch analysis (commented out to avoid API costs)
  console.log('\n💡 To run batch analysis example, uncomment the line below:');
  // await batchAnalysisExample();
  
  console.log('\n✨ All examples completed!');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
