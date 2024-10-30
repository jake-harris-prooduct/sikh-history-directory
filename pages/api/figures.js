// pages/api/figures.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    const RANGE = 'Sheet1!A2:I';

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    const figures = rows.map((row, index) => ({
      id: index + 1,
      englishName: row[0] || '',
      punjabiName: row[1] || '',
      birthYear: parseInt(row[2]) || null,
      deathYear: parseInt(row[3]) || null,
      oneLiner: row[4] || '',
      knownFor: row[5] || '',
      tags: row[6] || '',
      notableAssociates: row[7] || '',
      imageUrl: row[8] || '',
    }));

    res.status(200).json(figures);
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    res.status(500).json({ 
      message: 'Error fetching data from Google Sheets',
      error: error.message 
    });
  }
}
