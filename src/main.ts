// Aristotelian Character Database - TypeScript Main File

interface Character {
    id: string;
    name: string;
    hamartia: string;
    context: string;
    phronesis: 'low' | 'medium' | 'high';
    phronesisTrajectory: 'increasing' | 'decreasing' | 'constant';
    telos?: string;
    image?: string;
    tags: string[];
}

class CharacterDatabase {
    private characters: Character[] = [];

    constructor() {
        this.initializeApp();
    }

    private initializeApp(): void {
        console.log('🏛️ Aristotelian Character Database initialized');
        this.addEventListeners();
        this.displayWelcomeMessage();
    }

    private addEventListeners(): void {
        // Add click handlers for text blocks
        const textBlocks = document.querySelectorAll('.text-block');
        textBlocks.forEach((block, index) => {
            block.addEventListener('click', () => {
                this.handleBlockClick(index + 1);
            });
        });
    }

    private handleBlockClick(blockNumber: number): void {
        const messages = [
            'Character Analysis: Dive deep into tragic flaws and practical wisdom',
            'AI Insights: Discover the duality of hamartia - both blessing and curse', 
            'Database Browser: Explore patterns across literature and history'
        ];

        console.log(`📖 Clicked: ${messages[blockNumber - 1]}`);
        
        // Simple visual feedback
        const block = document.querySelector(`.text-block:nth-child(${blockNumber})`) as HTMLElement;
        if (block) {
            block.style.backgroundColor = '#e8f4fd';
            setTimeout(() => {
                block.style.backgroundColor = 'white';
            }, 300);
        }
    }

    private displayWelcomeMessage(): void {
        const welcomeData = {
            title: "Welcome to Aristotelian Character Analysis",
            description: "A philosophical approach to understanding character development",
            timestamp: new Date().toISOString()
        };
        
        console.log('🎭 Welcome Data:', welcomeData);
    }

    // Method to add a character (for future use)
    public addCharacter(character: Character): void {
        this.characters.push(character);
        console.log(`✅ Added character: ${character.name}`);
        this.displayCharacterInTable(character);
    }

    // Method to display character data in the HTML table
    private displayCharacterInTable(character: Character): void {
        // Find table and update the data row with character info
        const dataRow = document.querySelector('table tr:nth-child(2)');
        if (dataRow) {
            dataRow.innerHTML = `
                <td>${character.hamartia}</td>
                <td>${character.context}</td>
                <td>${character.phronesis}</td>
                <td>${character.phronesisTrajectory}</td>
                <td>${character.telos || 'Unknown'}</td>
            `;
        }
        
        // Also update the character name in the title
        const titleElement = document.querySelector('.main-title');
        if (titleElement) {
            titleElement.textContent = character.name;
        }

        // Update the header image if character has one
        const imageElement = document.querySelector('.header-image') as HTMLImageElement;
        if (imageElement && character.image) {
            imageElement.src = character.image;
            imageElement.alt = `${character.name} - Character Portrait`;
        }
    }

    // Method to get all characters (for future use)
    public getCharacters(): Character[] {
        return this.characters;
    }

    // Method to filter characters by hamartia (for future use)
    public filterByHamartia(hamartia: string): Character[] {
        return this.characters.filter(char => 
            char.hamartia.toLowerCase().includes(hamartia.toLowerCase())
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CharacterDatabase();
    
    // Example usage - add some sample characters
    app.addCharacter({
        id: '001',
        name: 'Hamlet',
        hamartia: 'indecision',
        context: 'royal court',
        phronesis: 'medium',
        phronesisTrajectory: 'decreasing',
        telos: 'tragic revenge',
        image: 'https://static.wikia.nocookie.net/characters/images/e/e9/Katara.jpg/revision/latest?cb=20170921222457',
        tags: ['tragedy', 'prince', 'revenge']
    });

    app.addCharacter({
        id: '002', 
        name: 'Macbeth',
        hamartia: 'ambition',
        context: 'political power',
        phronesis: 'low',
        phronesisTrajectory: 'decreasing',
        telos: 'tyrannical rule',
        image: 'https://static.wikia.nocookie.net/characters/images/e/e9/Katara.jpg/revision/latest?cb=20170921222457',
        tags: ['tragedy', 'king', 'prophecy']
    });

    console.log('📋 Total characters:', app.getCharacters().length);
});
