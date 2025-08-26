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

Your responses must be in valid JSON format matching this EXACT structure and style. Follow the template format precisely:
{
  "characterName": "string",
  "hamartia": "string",
  "context": "string", 
  "phronesisLevel": "string",
  "phronesisTrajectory": "string",
  "telos": "string",
  "universe": "string",
  "greatestWin": "string",
  "greatestDefeat": "string",
  "tags": ["string1", "string2", "string3"]
}

CRITICAL REQUIREMENTS:
- ALL fields are MANDATORY including "tags" - never omit any field
- "tags" must contain 3-5 relevant categorization tags
- Your response must match the formatting, length, and style of the template example provided in the user prompt
- Be specific, insightful, and philosophically grounded in your analysis`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 7000,
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
        universe: characterData.universe || 'Unknown universe',
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

1. **Hamartia** (tragic flaw): Their fundamental character flaw or error in judgment. It should be at most two english words

CRITICAL: It has to be the excess of deficiency of one of these 14 virtues. The hamartia can only be one of these 28 options.

'Courage deficiency'

'Courage excess'

'Temperance deficiency'

'Temperance excess'

'Liberality deficiency'

'Liberality excess'

'Magnificence deficiency'

'Magnificence excess'

'Magnanimity deficiency'

'Magnanimity excess'

'Ambition deficiency'

'Ambition excess'

'Patience deficiency'

'Patience excess'

'Truthfulness deficiency'

'Truthfulness excess'

'Wittiness deficiency'

'Wittiness excess'

'Friendliness deficiency'

'Friendliness excess'

'Theoretical Wisdom deficiency'

'Theoretical Wisdom excess'

'Intuition deficiency'

'Intuition excess'

'Episteme deficiency'

'Episteme excess'

'Techne deficiency'

'Techne excess'

Art / Craft (Skill)

2. **Context**: The specific situation or environment where this flaw causes the most problems. It should be at most two words with a greek translation in the latin alphabet.
3. **Phronesis Level**: Their practical wisdom level in one word (low/medium/high)
4. **Phronesis Trajectory**: How their wisdom changes in one word (increasing/decreasing/constant)
5. **Telos**: Their ultimate purpose, goal, or what they're striving toward
6. **Universe**: The fictional universe, story world, or source material they come from (e.g., "Marvel Universe", "Harry Potter", "Game of Thrones", "  World war 2")
7. **Greatest Win**: A specific victory where their traits served them well, the response should be around three sentences
8. **Greatest Defeat**: A specific failure directly caused by their hamartia, the response should be around three sentences
9. **Tags**: 3-5 categorization tags (e.g., anime, literature, history, science etc.) - THIS FIELD IS MANDATORY AND MUST BE INCLUDED


Here is an example response

{
  "characterName": "Hitler",
  "hamartia": "Excessive Ambition",
  "context": "War", 
  "phronesisLevel": "High",
  "phronesisTrajectory": "Decreasing",
  "telos": "Stablish a racially defined totalitarian empire dominated by what he considered the "Aryan" or "Germanic" race.",
  "universe": "World War 2",
  "greatestWin": "Hitler's rise to power in Germany exemplified his ability to exploit the economic and political instability of the Weimar Republic. Through his charismatic oratory and manipulative propaganda, he successfully consolidated power and garnered mass support.",
  "greatestDefeat": "His hubris led to the disastrous decision to invade the Soviet Union, underestimating both the resilience of the Russian people and the logistical challenges posed by the harsh winter. This miscalculation not only marked the turning point of the war but also significantly weakened his military position.",
  "tags": ["War", "History"]
}

{
  "characterName": "Achilles",
  "hamartia": "Patience Deficiency",
  "context": "Trojan War conflict with Agamemnon and the Trojans",
  "phronesisLevel": "Medium",
  "phronesisTrajectory": "Constant",
  "telos": "Sought eternal glory and honor on the battlefield, but his inability to temper anger diverted him from the common good of his army.",
  "universe": "Greek Mythology (Homer's Iliad)",
  "greatestWin": "Defeated Hector in single combat, avenging Patroclus and securing his place as the greatest warrior of the Greeks.",
  "greatestDefeat": "His rage-driven refusal to fight after Agamemnon's insult cost many Greek lives, and his wrathful excess led to desecrating Hector’s body — staining his honor.",
  "tags": ["Mythology", "Tragedy"]
}


Be specific and insightful. Focus on how their hamartia manifests in their context and how it leads to both their greatest triumph and downfall.

CRITICAL: Your response must follow the EXACT same format, structure, length, and style as the Hitler example above. Match the conciseness of "Excessive Ambition" for hamartia, "War" for context, the length of the telos statement, and especially the three-sentence format for greatestWin and greatestDefeat.

MANDATORY: Include the "tags" field with exactly 3-5 relevant categorization tags. DO NOT omit this field.

Return your analysis as a JSON object with the exact structure I specified, formatted identically to the template.`;

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
      universe: 'Unknown universe',
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
    console.log(`� Universe: ${hamlet.universe}`);
    console.log(`�🏆 Greatest Win: ${hamlet.greatestWin}`);
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
