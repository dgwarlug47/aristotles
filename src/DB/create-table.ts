/**
 * Simple Table Creator - Creates AristotelianCharacters table in AWS
 */

import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    region: 'us-east-1',
    // AWS credentials should be configured via AWS CLI
});

const dynamodb = new AWS.DynamoDB();

export interface TableSchema {
    tableName: string;
    primaryKey: string;
    fields: string[];
}

export class SimpleTableCreator {
    
    /**
     * Get the schema for AristotelianCharacters table
     */
    static getTableSchema(): TableSchema {
        return {
            tableName: 'AristotelianCharacters',
            primaryKey: 'id',
            fields: [
                'id',           // Primary key
                'name',         // Character name
                'hamartia',     // Tragic flaw
                'context',      // Where flaw manifests
                'phronesis',    // Practical wisdom level
                'phronesisTrajectory', // Wisdom change over time
                'telos',        // Ultimate purpose
                'greatestVictory',     // Greatest achievement
                'greatestDefeat',      // Greatest failure
                'tags',         // Array of tags
                'image',        // Character image URL
                'source'        // Source work/literature
            ]
        };
    }

    /**
     * Get DynamoDB table creation parameters
     */
    static getCreateTableParams() {
        const schema = this.getTableSchema();
        
        return {
            TableName: schema.tableName,
            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH' // Primary key
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'S' // String
                }
            ],
            BillingMode: 'PAY_PER_REQUEST' // Pay per use
        };
    }

    /**
     * Actually create the table in AWS (like minimal.py)
     */
    static async createTable(): Promise<any | null> {
        const params = this.getCreateTableParams();
        
        try {
            console.log(`🏗️  Creating table '${params.TableName}'...`);
            
            const result = await dynamodb.createTable(params).promise();
            
            // Wait for table to be active
            console.log('⏳ Waiting for table to be active...');
            await dynamodb.waitFor('tableExists', { TableName: params.TableName }).promise();
            
            console.log(`✅ Table '${params.TableName}' created successfully!`);
            return result.TableDescription || null;
            
        } catch (error: any) {
            if (error.code === 'ResourceInUseException') {
                console.log(`⚠️  Table '${params.TableName}' already exists`);
                return null;
            } else {
                console.error(`❌ Error creating table:`, error.message);
                throw error;
            }
        }
    }

    /**
     * Test the table by adding a sample character (like minimal.py)
     */
    static async testTableWithSample(): Promise<void> {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const tableName = this.getTableSchema().tableName;

        // Sample character data
        const sampleCharacter = {
            id: 'char_hamlet_001',
            name: 'Hamlet',
            hamartia: 'indecision',
            context: 'royal court',
            phronesis: 'high',
            phronesisTrajectory: 'decreasing',
            telos: 'restore justice to Denmark',
            greatestVictory: 'Exposing Claudius through the play-within-a-play',
            greatestDefeat: 'Death while achieving revenge, destroying his family line',
            tags: ['tragedy', 'prince', 'revenge', 'shakespeare'],
            source: "Shakespeare's Hamlet",
            image: 'https://via.placeholder.com/400x300/8b4513/d4af37?text=Hamlet'
        };

        try {
            // 1. Write sample character
            await docClient.put({
                TableName: tableName,
                Item: sampleCharacter
            }).promise();
            
            console.log("✅ Sample character (Hamlet) added to table");

            // 2. Read it back
            const result = await docClient.get({
                TableName: tableName,
                Key: { id: 'char_hamlet_001' }
            }).promise();

            if (result.Item) {
                console.log(`📖 Retrieved: ${result.Item.name} - hamartia: ${result.Item.hamartia}`);
            } else {
                console.log("❌ Character not found");
            }

        } catch (error: any) {
            console.error(`❌ Error testing table:`, error.message);
        }
    }

    /**
     * Main function to create table and test it
     */
    static async createAndTest(): Promise<void> {
        console.log('🏛️  ARISTOTELIAN CHARACTERS TABLE CREATOR');
        console.log('='.repeat(50));
        
        try {
            // Create the table
            await this.createTable();
            
            console.log('\n🧪 Testing table with sample data...');
            await this.testTableWithSample();
            
            console.log('\n✅ Table setup complete! Ready for your Aristotelian character analysis! 🎭');
            
        } catch (error) {
            console.error('❌ Setup failed:', error);
        }
    }

    /**
     * Display table information
     */
    static showTableInfo(): void {
        const schema = this.getTableSchema();
        
        console.log(`🏛️  TABLE: ${schema.tableName}`);
        console.log(`🔑 Primary Key: ${schema.primaryKey}`);
        console.log('📋 Fields:');
        
        schema.fields.forEach(field => {
            console.log(`   • ${field}`);
        });
        
        console.log('\n🏗️  Creation Parameters:');
        console.log(JSON.stringify(this.getCreateTableParams(), null, 2));
    }
}

// Run table creation when executed directly (like minimal.py)
if (typeof window === 'undefined') {
    // Node.js environment - create the table
    SimpleTableCreator.createAndTest();
} else {
    // Browser environment - just show info
    console.log('📚 Aristotelian Characters Table Schema Loaded');
    SimpleTableCreator.showTableInfo();
}

export default SimpleTableCreator;
