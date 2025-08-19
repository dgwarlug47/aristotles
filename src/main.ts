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
        tags: ['tragedy', 'prince', 'revenge']
    });

    app.addCharacter({
        id: '002', 
        name: 'Macbeth',
        hamartia: 'ambition',
        context: 'political power',
        phronesis: 'low',
        phronesisTrajectory: 'decreasing',
        tags: ['tragedy', 'king', 'prophecy']
    });

    console.log('📋 Total characters:', app.getCharacters().length);
});
