// Aristotelian Character Database - TypeScript Main File
class CharacterDatabase {
    constructor() {
        this.characters = [];
        this.initializeApp();
    }
    initializeApp() {
        console.log('🏛️ Aristotelian Character Database initialized');
        this.addEventListeners();
        this.displayWelcomeMessage();
    }
    addEventListeners() {
        // Add click handlers for text blocks
        const textBlocks = document.querySelectorAll('.text-block');
        textBlocks.forEach((block, index) => {
            block.addEventListener('click', () => {
                this.handleBlockClick(index + 1);
            });
        });
    }
    handleBlockClick(blockNumber) {
        const messages = [
            'Character Analysis: Dive deep into tragic flaws and practical wisdom',
            'AI Insights: Discover the duality of hamartia - both blessing and curse',
            'Database Browser: Explore patterns across literature and history'
        ];
        console.log(`📖 Clicked: ${messages[blockNumber - 1]}`);
        // Simple visual feedback
        const block = document.querySelector(`.text-block:nth-child(${blockNumber})`);
        if (block) {
            block.style.backgroundColor = '#e8f4fd';
            setTimeout(() => {
                block.style.backgroundColor = 'white';
            }, 300);
        }
    }
    displayWelcomeMessage() {
        const welcomeData = {
            title: "Welcome to Aristotelian Character Analysis",
            description: "A philosophical approach to understanding character development",
            timestamp: new Date().toISOString()
        };
        console.log('🎭 Welcome Data:', welcomeData);
    }
    // Method to add a character (for future use)
    addCharacter(character) {
        this.characters.push(character);
        console.log(`✅ Added character: ${character.name}`);
        this.displayCharacterInTable(character);
    }
    // Method to display character data in the HTML table
    displayCharacterInTable(character) {
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
    }
    // Method to get all characters (for future use)
    getCharacters() {
        return this.characters;
    }
    // Method to filter characters by hamartia (for future use)
    filterByHamartia(hamartia) {
        return this.characters.filter(char => char.hamartia.toLowerCase().includes(hamartia.toLowerCase()));
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
