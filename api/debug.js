// pages/api/debug.js
export default function handler(req, res) {
  const debug = {
    env: {
      hasApiKey: !!process.env.GOOGLE_SHEETS_API_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      apiKeyLength: process.env.GOOGLE_SHEETS_API_KEY?.length,
      sheetIdLength: process.env.GOOGLE_SHEET_ID?.length,
    },
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
  };
  
  console.log('Debug info:', debug);
  
  res.status(200).json(debug);
}
