// pages/api/figures.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

    if (!API_KEY) {
      throw new Error('GOOGLE_SHEETS_API_KEY environment variable is not set');
    }
    if (!SPREADSHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }

    const RANGE = 'Sheet1!A2:I';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    // Make the API request
    const response = await fetch(url);
    
    // Handle non-OK responses with more detail
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      
      // Specific error messages based on status codes
      switch (response.status) {
        case 403:
          throw new Error('API key unauthorized. Please check your API key and ensure it has access to Google Sheets API');
        case 404:
          throw new Error('Spreadsheet not found. Please check your spreadsheet ID');
        default:
          throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();

    // Validate data structure
    if (!data.values) {
      throw new Error('No data returned from Google Sheets. Please check if the spreadsheet has data and the range is correct');
    }

    // Process the rows
    const figures = data.values.map((row, index) => {
      // Validate row data
      if (row.length < 9) {
        console.warn(`Row ${index + 1} has insufficient columns`);
      }

      return {
        id: index + 1,
        englishName: row[0] || '',
        punjabiName: row[1] || '',
        birthYear: row[2] ? parseInt(row[2], 10) || null : null,
        deathYear: row[3] ? parseInt(row[3], 10) || null : null,
        oneLiner: row[4] || '',
        knownFor: row[5] || '',
        tags: row[6] ? row[6].split(',').map(tag => tag.trim()) : [], // Split tags into array
        notableAssociates: row[7] ? row[7].split(',').map(associate => associate.trim()) : [], // Split associates into array
        imageUrl: row[8] || '',
      };
    });

    res.status(200).json(figures);
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    
    // Send appropriate error response
    res.status(500).json({ 
      message: 'Error fetching data from Google Sheets',
      error: error.message,
      // Only include stack trace in development
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
