/**
 * Test the Character Analyzer
 * 
 * This file demonstrates how to use the CharacterAnalyzer to generate
 * character data and optionally save it to the database.
 */

import CharacterAnalyzer from './character-analyzer';
import CharacterDB from '../DB/dynamodb';
import { Character } from '../Models/character';

async function testSingleCharacter() {
  console.log('🧪 Testing Single Character Analysis\n');
  
  try {
    const analyzer = new CharacterAnalyzer();
    
    // Analyze a character
    const characterName = 'Macbeth';
    console.log(`Analyzing: ${characterName}`);
    
    const character = await analyzer.analyzeCharacter(characterName);
    
    // Display results
    console.log('\n📊 Analysis Results:');
    console.log('================================');
    console.log(`Name: ${character.characterName}`);
    console.log(`Hamartia: ${character.hamartia}`);
    console.log(`Context: ${character.context}`);
    console.log(`Phronesis Level: ${character.phronesisLevel}`);
    console.log(`Phronesis Trajectory: ${character.phronesisTrajectory}`);
    console.log(`Telos: ${character.telos}`);
    console.log(`Greatest Win: ${character.greatestWin}`);
    console.log(`Greatest Defeat: ${character.greatestDefeat}`);
    console.log(`Tags: ${character.tags.join(', ')}`);
    console.log(`Image: ${character.image}`);
    
    return character;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
}

async function testCharacterSuggestions() {
  console.log('\n🎭 Testing Character Suggestions\n');
  
  try {
    const analyzer = new CharacterAnalyzer();
    
    const themes = ['Greek tragedy', 'Shakespeare', 'Historical leaders'];
    
    for (const theme of themes) {
      console.log(`\n--- Suggestions for: ${theme} ---`);
      const suggestions = await analyzer.getCharacterSuggestions(theme, 3);
      suggestions.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Suggestions test failed:', error);
  }
}

async function testWithDatabase() {
  console.log('\n💾 Testing AI + Database Integration\n');
  
  try {
    const analyzer = new CharacterAnalyzer();
    const db = new CharacterDB();
    
    // Generate character data with AI
    const character = await analyzer.analyzeCharacter('Odysseus');
    
    if (character) {
      console.log('✅ Character analyzed successfully');
      
      // Save to database
      await db.putCharacter(character);
      console.log('✅ Character saved to database');
      
      // Retrieve from database to verify
      const retrieved = await db.getCharacter(character.characterName);
      
      if (retrieved) {
        console.log('✅ Character retrieved from database');
        console.log(`Verified: ${retrieved.characterName} - ${retrieved.hamartia}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database integration test failed:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Character Analyzer Tests\n');
  
  // Test 1: Single character analysis
  await testSingleCharacter();
  
  // Test 2: Character suggestions  
  await testCharacterSuggestions();
  
  // Test 3: Database integration (optional - requires DB setup)
  console.log('\n💡 To test database integration, uncomment the line below and ensure DB is set up');
  await testWithDatabase();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
