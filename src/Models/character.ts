export interface Character {
    id: string;
    characterName: string;
    hamartia: string;
    context: string;
    phronesisLevel: 'low' | 'medium' | 'high';
    phronesisTrajectory: 'increasing' | 'decreasing' | 'constant';
    telos?: string;
    universe?: string;
    image?: string;
    tags: string[];
    greatestWin?: string; // Optional field for future use;
    greatestDefeat?: string; // Optional field for future use;
}