/**
 * Aristotles DynamoDB Implementation
 * Creates and manages a DynamoDB table for Character data
 * Requires: AWS credentials configured (aws configure or ~/.aws/credentials)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand,
  DeleteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { Character } from '../Models/character';

export class CharacterDB {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(region: string = 'us-east-1', tableName: string = 'AristotlesCharacters2') {
    this.tableName = tableName;
    this.client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  /**
   * Add a new character to the database
   */
  async putCharacter(character: Character): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: character
      });

      await this.docClient.send(command);
      console.log(`✅ Character '${character.characterName}' added to DynamoDB`);
    } catch (error) {
      console.error(`❌ Error adding character: ${error}`);
      throw error;
    }
  }

  /**
   * Get a character by character name
   */
  async getCharacter(characterName: string): Promise<Character | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { characterName }
      });

      const response = await this.docClient.send(command);
      
      if (response.Item) {
        const character = response.Item as Character;
        console.log(`📖 Retrieved ${character.characterName} (hamartia: ${character.hamartia})`);
        return character;
      } else {
        console.log(`❌ Character '${characterName}' not found`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error getting character: ${error}`);
      throw error;
    }
  }

  /**
   * Get all characters from the database
   */
  async getAllCharacters(): Promise<Character[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName
      });

      const response = await this.docClient.send(command);
      const characters = (response.Items || []) as Character[];
      
      console.log(`📚 Retrieved ${characters.length} characters from database`);
      return characters;
    } catch (error) {
      console.error(`❌ Error getting all characters: ${error}`);
      throw error;
    }
  }

  /**
   * Update a character's information
   */
  async updateCharacter(characterName: string, updates: Partial<Character>): Promise<void> {
    try {
      // Remove characterName from updates if present
      const { characterName: _, ...updateAttributes } = updates;
      
      const updateExpression = Object.keys(updateAttributes)
        .map((key, index) => `#${key} = :val${index}`)
        .join(', ');
      
      const expressionAttributeNames = Object.keys(updateAttributes)
        .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
      
      const expressionAttributeValues = Object.keys(updateAttributes)
        .reduce((acc, key, index) => ({ 
          ...acc, 
          [`:val${index}`]: (updateAttributes as any)[key]
        }), {});

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { characterName },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      });

      const response = await this.docClient.send(command);
      const updatedCharacter = response.Attributes as Character;
      console.log(`✅ Character '${updatedCharacter.characterName}' updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating character: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a character from the database
   */
  async deleteCharacter(characterName: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { characterName }
      });

      await this.docClient.send(command);
      console.log(`✅ Character '${characterName}' deleted successfully`);
    } catch (error) {
      console.error(`❌ Error deleting character: ${error}`);
      throw error;
    }
  }

  /**
   * Find characters by hamartia (tragic flaw)
   */
  async getCharactersByHamartia(hamartia: string): Promise<Character[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'hamartia = :hamartia',
        ExpressionAttributeValues: {
          ':hamartia': hamartia
        }
      });

      const response = await this.docClient.send(command);
      const characters = (response.Items || []) as Character[];
      
      console.log(`🔍 Found ${characters.length} characters with hamartia: ${hamartia}`);
      return characters;
    } catch (error) {
      console.error(`❌ Error searching by hamartia: ${error}`);
      throw error;
    }
  }

  /**
   * Find characters by phronesis level
   */
  async getCharactersByPhronesisLevel(phronesisLevel: string): Promise<Character[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'phronesisLevel = :phronesisLevel',
        ExpressionAttributeValues: {
          ':phronesisLevel': phronesisLevel
        }
      });

      const response = await this.docClient.send(command);
      const characters = (response.Items || []) as Character[];
      
      console.log(`🧠 Found ${characters.length} characters with ${phronesisLevel} phronesis level`);
      return characters;
    } catch (error) {
      console.error(`❌ Error searching by phronesis level: ${error}`);
      throw error;
    }
  }
}

/**
 * Example usage - similar to minimal.py functionality
 */
async function main() {
  try {
    // Initialize the database connection
    const characterDB = new CharacterDB();

    // Create sample character (similar to minimal.py)
    const hamlet: Character = {
      characterName: 'Hamlet',
      hamartia: 'indecision',
      context: 'Danish prince seeking revenge for his father\'s murder',
      phronesisLevel: 'high',
      phronesisTrajectory: 'decreasing',
      telos: 'Restore justice to Denmark',
      greatestWin: 'Successfully exposed Claudius\'s guilt through the play-within-a-play',
      greatestDefeat: 'His indecision led to the deaths of Polonius, Ophelia, Gertrude, and ultimately himself',
      tags: ['tragedy', 'revenge', 'royalty', 'melancholy', 'danish'],
      image: 'hamlet.jpg'
    };

    // 1. Write character to database
    await characterDB.putCharacter(hamlet);

    // 2. Read character from database
    const retrievedCharacter = await characterDB.getCharacter('Hamlet');
    
    if (retrievedCharacter) {
      console.log(`📖 ${retrievedCharacter.characterName}'s hamartia is ${retrievedCharacter.hamartia}`);
      console.log(`🧠 Phronesis level: ${retrievedCharacter.phronesisLevel} (${retrievedCharacter.phronesisTrajectory})`);
      console.log(`🎯 Telos: ${retrievedCharacter.telos}`);
      console.log(`🏆 Greatest Win: ${retrievedCharacter.greatestWin}`);
      console.log(`💔 Greatest Defeat: ${retrievedCharacter.greatestDefeat}`);
    }

    // 3. Demonstrate additional functionality
    console.log('\n--- Additional Examples ---');
    
    // Add another character
    const macbeth: Character = {
      characterName: 'Macbeth',
      hamartia: 'ambition',
      context: 'Scottish general corrupted by prophecy and ambition',
      phronesisLevel: 'medium',
      phronesisTrajectory: 'decreasing',
      telos: 'Become King of Scotland',
      greatestWin: 'Successfully seized the throne through decisive action and military prowess',
      greatestDefeat: 'His unchecked ambition led to paranoia, tyranny, and ultimately his death',
      tags: ['tragedy', 'ambition', 'prophecy', 'guilt', 'scottish'],
      image: 'macbeth.jpg'
    };

    await characterDB.putCharacter(macbeth);

    // Search by hamartia
    const ambitiousCharacters = await characterDB.getCharactersByHamartia('ambition');
    
    // Get all characters
    const allCharacters = await characterDB.getAllCharacters();
    console.log(`\n📚 Total characters in database: ${allCharacters.length}`);

  } catch (error: any) {
    if (error.name === 'CredentialsError' || error.message?.includes('credentials')) {
      console.log("❌ AWS credentials not found!");
      console.log("To fix this:");
      console.log("1. Install AWS CLI: brew install awscli");
      console.log("2. Configure credentials: aws configure");
      console.log("3. Enter your Access Key ID and Secret Access Key");
    } else if (error.message?.includes('does not exist')) {
      console.log(`❌ Table 'AristotlesCharacters' doesn't exist`);
      console.log("Create it in AWS Console or use table-creator.ts");
    } else {
      console.log(`❌ Error: ${error.message || error}`);
    }
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default CharacterDB;
