export interface Character {
    id: string;
    name: string;
    hamartia: string;
    context: string;
    phronesis: 'low' | 'medium' | 'high';
    phronesisTrajectory: 'increasing' | 'decreasing' | 'constant';
    telos?: string;
    image?: string;
    tags: string[];
    greatestVictory?: string; // Optional field for future use;
    greatestDefeat?: string; // Optional field for future use;
}