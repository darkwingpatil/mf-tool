import fs from 'fs/promises';
import axios from 'axios';

/**
 * Interface representing mutual fund scheme code reference
 */
interface SchemaCodeReference {
    schemeCode: string;
    schemeName: string;
    isinGrowth: string | null;
    isinDivReinvestment: string | null;
}

/**
 * A utility class to interact with mutual fund APIs and manage schema code references
 */
export class MfTool {
    private schemaCodeReference: SchemaCodeReference[] = [];
    public axios: typeof axios = axios;
    public apiHeaders = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        }
    };

    constructor() {}

    /**
     * Updates the schema code reference list.
     * @param forcePull Whether to forcefully pull fresh data from the API.
     */
    async updateSchemaCodes(forcePull: boolean = false) {
        try {
            if (forcePull) {
                const { data: latestSchemaCodes } = await this.axios.get('https://api.mfapi.in/mf', this.apiHeaders);
                console.log('Fetched latest schema codes from API.');
                
                // Write the fetched data to a local file
                await fs.writeFile('./schema_codes.txt', JSON.stringify(latestSchemaCodes, null, 2), 'utf-8');
                console.log('Data successfully written to schema_codes.txt');
            }

            // Read data from local file
            const schemaCodeRawData = await fs.readFile('./schema_codes.txt', 'utf-8');
            this.schemaCodeReference = JSON.parse(schemaCodeRawData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching latest schema codes:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    /**
     * Finds mutual fund schemes matching user input.
     * @param userInput The user's search input.
     * @returns An array of matching schema code references.
     */
    async findSchemaCodeReference(userInput: string) {
        if (!userInput) throw new Error('User input is required');

        // Lazy-load schema codes if not already loaded
        if (this.schemaCodeReference.length === 0) {
            await this.updateSchemaCodes();
            console.log('Schema code data loaded.');
        }

        // Escape user input for regex search
        const escapedInput = userInput.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const inputRegex = new RegExp(escapedInput.split(/\s+/).join('.*'), 'i');

        // Filter matching schemes
        return this.schemaCodeReference.filter(item => inputRegex.test(item.schemeName));
    }

    /**
     * Retrieves all available schema code references.
     * @returns An array of all schema code references.
     */
    async getAllSchemaCodeReference() {
        if (this.schemaCodeReference.length === 0) {
            await this.updateSchemaCodes();
            console.log('Schema code data loaded.');
        }
        return this.schemaCodeReference;
    }

    /**
     * Fetches NAV details for a specific mutual fund scheme.
     * @param schemaCode The scheme code.
     * @param needHistoric Whether to fetch full historical NAVs or just the latest.
     * @returns The NAV details data.
     */
    async getFundNavDetails(schemaCode: string, needHistoric: boolean = false) {
        try {
            const url = needHistoric
                ? `https://api.mfapi.in/mf/${schemaCode}`
                : `https://api.mfapi.in/mf/${schemaCode}/latest`;

            const { data } = await this.axios.get(url, this.apiHeaders);
            return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error getting MF NAV details:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }
}
