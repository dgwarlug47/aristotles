/**
 * Simple Express server to serve the frontend and provide API access to DynamoDB
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

// Import the TypeScript CharacterDB class (will need to be compiled first)
// For now, we'll use a mock implementation

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mock CharacterDB for demonstration
// In production, this would import the compiled TypeScript version
class MockCharacterDB {
    constructor() {
        this.mockDatabase = {
            'Hamlet': {
                id: 'hamlet-001',
                characterName: 'Hamlet',
                hamartia: 'indecision and overthinking',
                context: 'Danish prince seeking revenge for his father\'s murder',
                phronesisLevel: 'high',
                phronesisTrajectory: 'decreasing',
                telos: 'Restore justice to Denmark',
                greatestWin: 'Successfully exposed Claudius\'s guilt through the play-within-a-play',
                greatestDefeat: 'His indecision led to the deaths of Polonius, Ophelia, Gertrude, and ultimately himself',
                tags: ['tragedy', 'revenge', 'royalty', 'melancholy', 'danish'],
                image: 'https://static.wikia.nocookie.net/avatar/images/c/ce/Aang.png/revision/latest?cb=20161129194603&path-prefix=pt-br'
            },
            'Macbeth': {
                id: 'macbeth-001',
                characterName: 'Macbeth',
                hamartia: 'unchecked ambition',
                context: 'Scottish general corrupted by prophecy and ambition',
                phronesisLevel: 'medium',
                phronesisTrajectory: 'decreasing',
                telos: 'Become King of Scotland',
                greatestWin: 'Successfully seized the throne through decisive action',
                greatestDefeat: 'His ambition led to paranoia, tyranny, and ultimately his death',
                tags: ['tragedy', 'ambition', 'prophecy', 'guilt', 'scottish'],
                image: 'https://static.wikia.nocookie.net/avatar/images/c/ce/Aang.png/revision/latest?cb=20161129194603&path-prefix=pt-br'
            },
            'Odysseus': {
                id: 'odysseus-001',
                characterName: 'Odysseus',
                hamartia: 'pride and curiosity',
                context: 'Greek hero returning home after the Trojan War',
                phronesisLevel: 'high',
                phronesisTrajectory: 'increasing',
                telos: 'Return home to Ithaca and restore his kingdom',
                greatestWin: 'Successfully devised the Trojan Horse strategy',
                greatestDefeat: 'His pride led to angering Poseidon and a 10-year journey home',
                tags: ['epic', 'journey', 'cleverness', 'greek', 'hero'],
                image: 'https://static.wikia.nocookie.net/avatar/images/c/ce/Aang.png/revision/latest?cb=20161129194603&path-prefix=pt-br'
            }
        };
    }

    async getCharacter(characterName) {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Case-insensitive search
        const normalizedName = characterName.toLowerCase();
        const found = Object.keys(this.mockDatabase).find(
            key => key.toLowerCase() === normalizedName
        );
        
        return found ? this.mockDatabase[found] : null;
    }
}

// Initialize mock database
const characterDB = new CharacterDB()

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get a character
app.get('/api/characters/:name', async (req, res) => {
    try {
        const characterName = req.params.name;
        console.log(`🔍 API request for character: ${characterName}`);
        
        const character = await characterDB.getCharacter(characterName);
        
        if (character) {
            console.log(`✅ Found character: ${character.characterName}`);
            res.json(character);
        } else {
            console.log(`❌ Character not found: ${characterName}`);
            res.status(404).json({ error: 'Character not found' });
        }
    } catch (error) {
        console.error('❌ API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get all characters
app.get('/api/characters', async (req, res) => {
    try {
        const characters = Object.values(characterDB.mockDatabase);
        res.json(characters);
    } catch (error) {
        console.error('❌ API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🏛️ Aristotelian Character Database Server running on http://localhost:${PORT}`);
    console.log(`📖 Available characters: ${Object.keys(characterDB.mockDatabase).join(', ')}`);
    console.log(`🔍 Try searching at: http://localhost:${PORT}`);
});

module.exports = app;
