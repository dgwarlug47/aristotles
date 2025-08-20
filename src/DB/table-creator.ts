/**
 * DynamoDB Table Creator for Aristotles Characters
 * This utility creates the DynamoDB table with proper schema
 * 
 * Complete Character Schema (defined in TypeScript interface):
 * - characterName: string (PRIMARY KEY)
 * - hamartia: string  
 * - context: string
 * - phronesisLevel: string
 * - phronesisTrajectory: string
 * - telos: string
 * - greatestWin: string
 * - greatestDefeat: string
 * - tags: string[]
 * - image: string
 * 
 * Note: DynamoDB only requires key attributes to be defined in the table schema.
 * All other attributes are schema-less and validated by the TypeScript interface.
 */

import { 
  DynamoDBClient, 
  CreateTableCommand,
  DescribeTableCommand,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb';

export class TableCreator {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(region: string = 'us-east-1', tableName: string = 'AristotlesCharacters2') {
    this.client = new DynamoDBClient({ region });
    this.tableName = tableName;
  }

  /**
   * Create the Characters table with the new schema
   * 
   * Table Schema:
   * - Primary Key: characterName (string)
   * - All other fields are schema-less (defined in Character interface):
   *   hamartia, context, phronesisLevel, phronesisTrajectory, 
   *   telos, greatestWin, greatestDefeat, tags[], image
   */
  async createTable(): Promise<void> {
    try {
      // Check if table already exists
      const exists = await this.tableExists();
      if (exists) {
        console.log(`✅ Table '${this.tableName}' already exists`);
        return;
      }

      const command = new CreateTableCommand({
        TableName: this.tableName,
        KeySchema: [
          {
            AttributeName: 'characterName', // Character name as primary key
            KeyType: 'HASH' // Partition key
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: 'characterName', // Only key attributes need to be defined
            AttributeType: 'S' // String type
          }
        ],
        BillingMode: 'PAY_PER_REQUEST', // On-demand pricing (no provisioned capacity needed)
        Tags: [
          {
            Key: 'Project',
            Value: 'Aristotles'
          },
          {
            Key: 'Purpose',
            Value: 'Character Management with New Schema'
          },
          {
            Key: 'Schema',
            Value: 'characterName-hamartia-context-phronesis-telos-victories-defeats'
          }
        ]
      });

      console.log(`🔄 Creating table '${this.tableName}' with new schema...`);
      console.log(`📋 Primary Key: characterName (string)`);
      console.log(`📝 Schema: All Aristotelian character fields supported`);
      const response = await this.client.send(command);
      
      console.log(`✅ Table '${this.tableName}' created successfully with new schema!`);
      console.log(`📊 Table ARN: ${response.TableDescription?.TableArn}`);
      console.log(`💰 Billing Mode: ${response.TableDescription?.BillingModeSummary?.BillingMode}`);
      
      // Wait for table to be active
      await this.waitForTableActive();
      
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`✅ Table '${this.tableName}' already exists`);
      } else {
        console.error(`❌ Error creating table: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Check if the table exists
   */
  async tableExists(): Promise<boolean> {
    try {
      const command = new ListTablesCommand({});
      const response = await this.client.send(command);
      return response.TableNames?.includes(this.tableName) || false;
    } catch (error) {
      console.error(`❌ Error checking table existence: ${error}`);
      return false;
    }
  }

  /**
   * Wait for table to become active
   */
  async waitForTableActive(): Promise<void> {
    console.log('🔄 Waiting for table to become active...');
    
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max wait time
    
    while (attempts < maxAttempts) {
      try {
        const command = new DescribeTableCommand({
          TableName: this.tableName
        });
        
        const response = await this.client.send(command);
        const status = response.Table?.TableStatus;
        
        if (status === 'ACTIVE') {
          console.log('✅ Table is now active and ready to use!');
          return;
        }
        
        console.log(`⏳ Table status: ${status}. Waiting...`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        attempts++;
        
      } catch (error) {
        console.error(`❌ Error checking table status: ${error}`);
        throw error;
      }
    }
    
    throw new Error('Timeout waiting for table to become active');
  }

  /**
   * Get table information
   */
  async getTableInfo(): Promise<void> {
    try {
      const command = new DescribeTableCommand({
        TableName: this.tableName
      });
      
      const response = await this.client.send(command);
      const table = response.Table;
      
      if (table) {
        console.log(`\n📊 Table Information:`);
        console.log(`   Name: ${table.TableName}`);
        console.log(`   Status: ${table.TableStatus}`);
        console.log(`   Creation Date: ${table.CreationDateTime}`);
        console.log(`   Item Count: ${table.ItemCount}`);
        console.log(`   Table Size: ${table.TableSizeBytes} bytes`);
        console.log(`   Billing Mode: ${table.BillingModeSummary?.BillingMode}`);
        console.log(`   Primary Key: ${table.KeySchema?.[0]?.AttributeName} (${table.KeySchema?.[0]?.KeyType})`);
        console.log(`\n📋 Schema Fields (defined in TypeScript interface):`);
        console.log(`   • characterName (PRIMARY KEY) - Character name`);
        console.log(`   • hamartia - Tragic flaw`);
        console.log(`   • context - Where the flaw causes problems`);
        console.log(`   • phronesisLevel - Practical wisdom level`);
        console.log(`   • phronesisTrajectory - Wisdom trajectory`);
        console.log(`   • telos - Purpose/goal`);
        console.log(`   • greatestWin - Greatest victory`);
        console.log(`   • greatestDefeat - Greatest defeat`);
        console.log(`   • tags - Array of categorization tags`);
        console.log(`   • image - Image URL or path`);
      }
      
    } catch (error) {
      console.error(`❌ Error getting table info: ${error}`);
      throw error;
    }
  }
}

/**
 * Main function to create the table with new schema
 */
async function main() {
  try {
    const tableCreator = new TableCreator();
    
    console.log('🚀 Starting DynamoDB table creation for Aristotles Characters...');
    console.log('📋 New Schema: characterName + hamartia + context + phronesis + telos + victories/defeats\n');
    
    await tableCreator.createTable();
    await tableCreator.getTableInfo();
    
    console.log('\n🎉 Setup complete! New schema table ready for character management.');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run simple (to test with new schema)');
    console.log('   2. Run: npm run dev (for full example with new schema)');
    console.log('   3. Or import CharacterDB in your application');
    
  } catch (error: any) {
    if (error.name === 'CredentialsError' || error.message?.includes('credentials')) {
      console.log("❌ AWS credentials not found!");
      console.log("To fix this:");
      console.log("1. Install AWS CLI: brew install awscli");
      console.log("2. Configure credentials: aws configure");
      console.log("3. Enter your Access Key ID and Secret Access Key");
    } else {
      console.log(`❌ Error: ${error.message || error}`);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default TableCreator;
