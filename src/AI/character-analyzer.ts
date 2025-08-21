/**
 * Aristotelian Character Analyzer using OpenAI API
 * 
 * This module uses OpenAI to analyze characters and generate
 * Aristotelian character traits including hamartia, phronesis, telos, etc.
 */

import OpenAI from 'openai';
import { Character } from '../Models/character';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class CharacterAnalyzer {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it to constructor.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Analyze a character using OpenAI and return Aristotelian character traits
   */
  async analyzeCharacter(characterName: string): Promise<Character> {
    try {
      console.log(`🤖 Analyzing character: ${characterName}`);

      const prompt = this.buildAnalysisPrompt(characterName);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert in Aristotelian philosophy and character analysis. You analyze fictional and historical characters through the lens of Aristotelian concepts like hamartia (tragic flaw), phronesis (practical wisdom), and telos (purpose/end goal).

Your responses must be in valid JSON format matching this exact structure:
{
  "characterName": "string",
  "hamartia": "string",
  "context": "string", 
  "phronesisLevel": "string",
  "phronesisTrajectory": "string",
  "telos": "string",
  "greatestWin": "string",
  "greatestDefeat": "string",
  "tags": ["string1", "string2"],
  "image": "string"
}

Be specific, insightful, and philosophically grounded in your analysis.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      console.log(`✅ Analysis complete for ${characterName}`);
      
      // Parse the JSON response (handle markdown code blocks)
      let jsonString = response.trim();
      
      // Remove markdown code block markers if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const characterData = JSON.parse(jsonString);
      
      // Validate and structure the response
      const character: Character = {
        id: characterData.id || `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        characterName: characterData.characterName || characterName,
        hamartia: characterData.hamartia || 'Unknown flaw',
        context: characterData.context || 'Unknown context',
        phronesisLevel: characterData.phronesisLevel || 'medium',
        phronesisTrajectory: characterData.phronesisTrajectory || 'constant',
        telos: characterData.telos || 'Unknown purpose',
        greatestWin: characterData.greatestWin || 'Unknown victory',
        greatestDefeat: characterData.greatestDefeat || 'Unknown defeat',
        tags: characterData.tags || ['unknown'],
        image: characterData.image || `${characterName.toLowerCase().replace(/\s+/g, '-')}.jpg`
      };

      return character;

    } catch (error) {
      console.error(`❌ Error analyzing character ${characterName}:`, error);
      
      // Return a basic character structure with error information
      return this.createFallbackCharacter(characterName, error);
    }
  }

  /**
   * Build the analysis prompt for OpenAI
   */
  private buildAnalysisPrompt(characterName: string): string {
    return `Analyze the character "${characterName}" through an Aristotelian philosophical lens. Provide:

1. **Hamartia** (tragic flaw): Their fundamental character flaw or error in judgment
2. **Context**: The specific situation or environment where this flaw causes the most problems
3. **Phronesis Level**: Their practical wisdom level (low/medium/high) 
4. **Phronesis Trajectory**: How their wisdom changes (increasing/decreasing/constant)
5. **Telos**: Their ultimate purpose, goal, or what they're striving toward
6. **Greatest Win**: A specific victory where their traits served them well
7. **Greatest Defeat**: A specific failure directly caused by their hamartia
8. **Tags**: 3-5 categorization tags (e.g., anime, literature, history, science etc.)
9. **Image**: Suggest a http URL of an image of this character. Please ensure the URL is accessible and relevant to the character.

Be specific and insightful. Focus on how their hamartia manifests in their context and how it leads to both their greatest triumph and downfall.

Return your analysis as a JSON object with the exact structure I specified.`;
  }

  /**
   * Create a fallback character when OpenAI analysis fails
   */
  private createFallbackCharacter(characterName: string, error: any): Character {
    return {
      id: `fallback-${Date.now()}`,
      characterName,
      hamartia: 'Analysis failed - Unable to determine tragic flaw',
      context: 'Unknown context due to analysis error',
      phronesisLevel: 'medium',
      phronesisTrajectory: 'constant',
      telos: 'Unable to determine purpose',
      greatestWin: 'Analysis incomplete',
      greatestDefeat: `AI analysis failed: ${error.message || 'Unknown error'}`,
      tags: ['error', 'incomplete-analysis'],
      image: `${characterName.toLowerCase().replace(/\s+/g, '-')}.jpg`
    };
  }

  /**
   * Analyze multiple characters in batch
   */
  async analyzeCharacters(characterNames: string[]): Promise<Character[]> {
    console.log(`🤖 Starting batch analysis of ${characterNames.length} characters...`);
    
    const characters: Character[] = [];
    
    for (const name of characterNames) {
      try {
        const character = await this.analyzeCharacter(name);
        characters.push(character);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to analyze ${name}:`, error);
        characters.push(this.createFallbackCharacter(name, error));
      }
    }
    
    console.log(`✅ Batch analysis complete: ${characters.length} characters analyzed`);
    return characters;
  }

  /**
   * Get character suggestions based on a theme or category
   */
  async getCharacterSuggestions(theme: string, count: number = 5): Promise<string[]> {
    try {
      console.log(`🔍 Getting character suggestions for theme: ${theme}`);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert in literature, history, and mythology. Suggest interesting characters that would be good for Aristotelian character analysis."
          },
          {
            role: "user", 
            content: `Suggest ${count} interesting characters related to the theme "${theme}" that would be excellent for Aristotelian character analysis (hamartia, phronesis, telos). Include a mix of fictional and historical figures. Return only the character names, one per line.`
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) return [];

      const suggestions = response.trim().split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, count);

      console.log(`✅ Found ${suggestions.length} character suggestions`);
      return suggestions;

    } catch (error) {
      console.error(`❌ Error getting suggestions for theme ${theme}:`, error);
      return [];
    }
  }
}

/**
 * Simple usage example
 */
async function example() {
  try {
    // Initialize the analyzer
    const analyzer = new CharacterAnalyzer();

    // Analyze a single character
    console.log('=== Single Character Analysis ===');
    const hamlet = await analyzer.analyzeCharacter('Hamlet');
    
    console.log(`\n📖 Character: ${hamlet.characterName}`);
    console.log(`💔 Hamartia: ${hamlet.hamartia}`);
    console.log(`🌍 Context: ${hamlet.context}`);
    console.log(`🧠 Phronesis: ${hamlet.phronesisLevel} (${hamlet.phronesisTrajectory})`);
    console.log(`🎯 Telos: ${hamlet.telos}`);
    console.log(`🏆 Greatest Win: ${hamlet.greatestWin}`);
    console.log(`💀 Greatest Defeat: ${hamlet.greatestDefeat}`);
    console.log(`🏷️ Tags: ${hamlet.tags.join(', ')}`);

    // Get character suggestions
    console.log('\n=== Character Suggestions ===');
    const suggestions = await analyzer.getCharacterSuggestions('tragic heroes', 3);
    console.log('Suggested characters:', suggestions);

  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  example().catch(console.error);
}

export default CharacterAnalyzer;
