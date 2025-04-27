# Indian MF Tool

[![npm version](https://img.shields.io/npm/v/indian-mf-tool.svg)](https://www.npmjs.com/package/indian-mf-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight Node.js and TypeScript utility for fetching Indian Mutual Fund data from mfapi.in, including scheme details, NAVs, and historical data.

## Features

- Fetch complete list of Indian Mutual Fund schemes
- Search for specific Mutual Fund schemes by name
- Get latest NAV for any Mutual Fund scheme
- Retrieve historical NAV data
- Automatic local caching for improved performance

## Installation

```bash
npm install indian-mf-tool
```

## Quick Start

```typescript
import { MfTool } from 'indian-mf-tool';

// Initialize the tool
const mfTool = new MfTool();

// Example: Search for a mutual fund scheme
async function findScheme() {
  const schemes = await mfTool.findSchemaCodeReference('SBI Blue Chip');
  console.log(schemes);
}

// Example: Get NAV details for a specific scheme
async function getNavDetails() {
  const navDetails = await mfTool.getFundNavDetails('123456');
  console.log(navDetails);
}
```

## API Reference

### `new MfTool()`

Creates a new instance of the MF Tool.

### `updateSchemaCodes(forcePull?: boolean): Promise<void>`

Updates the local cache of mutual fund scheme codes.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| forcePull | boolean | false | When true, ignores local cache and fetches fresh data from API |

### `findSchemaCodeReference(userInput: string): Promise<SchemaCodeReference[]>`

Searches for mutual fund schemes that match the input string.

| Parameter | Type | Description |
|-----------|------|-------------|
| userInput | string | Search term for mutual fund scheme names |

**Returns:** Array of matching `SchemaCodeReference` objects

### `getAllSchemaCodeReference(): Promise<SchemaCodeReference[]>`

Retrieves all available mutual fund schemes.

**Returns:** Array of all `SchemaCodeReference` objects

### `getFundNavDetails(schemaCode: string, needHistoric?: boolean): Promise<NavDetails>`

Fetches NAV details for a specific mutual fund scheme.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| schemaCode | string | | The unique code of the mutual fund scheme |
| needHistoric | boolean | false | When true, includes historical NAV data |

**Returns:** `NavDetails` object containing the NAV information

## Example Usage

### Finding a Mutual Fund Scheme

```typescript
import { MfTool } from 'indian-mf-tool';

async function searchFund() {
  const mfTool = new MfTool();
  
  // Search for HDFC funds
  const hdcpFunds = await mfTool.findSchemaCodeReference('HDFC');
  
  // Print the first 5 results
  console.log(hdcpFunds.slice(0, 5));
}

searchFund();
```

### Getting NAV Details

```typescript
import { MfTool } from 'indian-mf-tool';

async function getNavInfo() {
  const mfTool = new MfTool();
  
  // First find the scheme code
  const schemes = await mfTool.findSchemaCodeReference('Axis Bluechip Fund');
  
  if (schemes.length > 0) {
    // Get NAV details for the first matching scheme
    const navDetails = await mfTool.getFundNavDetails(schemes[0].schemaCode);
    console.log(`Latest NAV: ${navDetails.data.nav}`);
    console.log(`Date: ${navDetails.data.date}`);
  }
}

getNavInfo();
```

### Working with Historical Data

```typescript
import { MfTool } from 'indian-mf-tool';

async function getHistoricalNav() {
  const mfTool = new MfTool();
  
  // Get scheme with historical data
  const schemeCode = '119551'; // Example scheme code
  const navDetails = await mfTool.getFundNavDetails(schemeCode, true);
  
  // Access historical data
  const historicalData = navDetails.data.navHistory;

  console.log(historicalData);
}

getHistoricalNav();
```

## Data Types

### SchemaCodeReference

```typescript
interface SchemaCodeReference {
  schemaCode: string;
  schemeName: string;
}
```


## Error Handling

```typescript
import { MfTool } from 'indian-mf-tool';

async function handleErrors() {
  const mfTool = new MfTool();
  
  try {
    // Using an invalid scheme code
    const navDetails = await mfTool.getFundNavDetails('invalid-code');
    console.log(navDetails);
  } catch (error) {
    console.error('Error fetching NAV details:', error.message);
  }
}

handleErrors();
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on our GitHub repository.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Data provided by [mfapi.in](https://www.mfapi.in/)