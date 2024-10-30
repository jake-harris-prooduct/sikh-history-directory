// pages/api/debug-detailed.js
export default async function handler(req, res) {
  const debug = {
    env: {
      hasApiKey: !!process.env.GOOGLE_SHEETS_API_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      apiKeyLength: process.env.GOOGLE_SHEETS_API_KEY?.length,
      sheetIdLength: process.env.GOOGLE_SHEET_ID?.length,
      // Show first/last 4 chars to verify without exposing full key
      apiKeyPreview: process.env.GOOGLE_SHEETS_API_KEY ? 
        `${process.env.GOOGLE_SHEETS_API_KEY.slice(0,4)}...${process.env.GOOGLE_SHEETS_API_KEY.slice(-4)}` : null,
      sheetIdPreview: process.env.GOOGLE_SHEET_ID ? 
        `${process.env.GOOGLE_SHEET_ID.slice(0,4)}...${process.env.GOOGLE_SHEET_ID.slice(-4)}` : null,
    },
    test: {
      url: null,
      response: null,
      error: null
    }
  };

  // Only test API if we have both values
  if (process.env.GOOGLE_SHEETS_API_KEY && process.env.GOOGLE_SHEET_ID) {
    try {
      const RANGE = 'Sheet1!A1:A1';  // Just test first cell
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${RANGE}?key=${process.env.GOOGLE_SHEETS_API_KEY}`;
      debug.test.url = url.replace(process.env.GOOGLE_SHEETS_API_KEY, 'REDACTED');
      
      const response = await fetch(url);
      debug.test.response = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      };

      if (!response.ok) {
        const errorText = await response.text();
        debug.test.error = errorText;
      } else {
        const data = await response.json();
        debug.test.data = {
          hasValues: !!data.values,
          firstCell: data.values?.[0]?.[0] || null
        };
      }
    } catch (error) {
      debug.test.error = error.message;
    }
  }

  res.status(200).json(debug);
}
