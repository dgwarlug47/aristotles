/**
 * Simple Example - TypeScript equivalent of minimal.py
 * Demonstrates basic DynamoDB operations for Character data
 */

import CharacterDB from './dynamodb';
import { Character } from '../Models/character';

async function simpleExample() {
  console.log('🎭 Aristotles DynamoDB TypeScript Example\n');
  
  try {
    // 1. Connect (equivalent to boto3.resource)
    const db = new CharacterDB('us-east-1', 'AristotlesCharacters2');

    // 2. Write (equivalent to table.put_item)
    const hamlet: Character = {
      characterName: 'Hamlet',
      hamartia: 'indecision',
      context: 'Danish prince troubled by his father\'s ghost',
      phronesisLevel: 'high',
      phronesisTrajectory: 'decreasing',
      telos: 'Avenge his father and restore order',
      greatestWin: 'Successfully exposed Claudius\'s guilt through the play-within-a-play',
      greatestDefeat: 'His indecision led to the deaths of Polonius, Ophelia, Gertrude, and ultimately himself',
      tags: ['tragedy', 'revenge', 'melancholy', 'danish'],
      image: 'hamlet.jpg'
    };

    await db.putCharacter(hamlet);

    // 3. Read (equivalent to table.get_item)
    const retrievedCharacter = await db.getCharacter('Hamlet');
    
    if (retrievedCharacter) {
      // Same output format as minimal.py
      console.log(`📖 ${retrievedCharacter.characterName}'s flaw is ${retrievedCharacter.hamartia}`);
      console.log(`🧠 Phronesis: ${retrievedCharacter.phronesisLevel} (${retrievedCharacter.phronesisTrajectory})`);
      console.log(`🎯 Telos: ${retrievedCharacter.telos}`);
    }

  } catch (error: any) {
    // Error handling equivalent to minimal.py
    if (error.name === 'CredentialsError' || error.message?.includes('credentials')) {
      console.log("❌ AWS credentials not found!");
      console.log("To fix this:");
      console.log("1. Install AWS CLI: brew install awscli");
      console.log("2. Configure credentials: aws configure");
      console.log("3. Enter your Access Key ID and Secret Access Key");
    } else if (error.message?.includes('does not exist')) {
      console.log("❌ Table 'AristotlesCharacters' doesn't exist");
      console.log("Create it by running: npm run create-table");
    } else {
      console.log(`❌ Error: ${error.message || error}`);
    }
  }
}

// Run the example
if (require.main === module) {
  simpleExample().catch(console.error);
}

export { simpleExample };
