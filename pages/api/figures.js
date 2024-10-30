// pages/api/figures.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Auth configuration
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A2:I', // Assuming headers are in row 1
    });

    const rows = response.data.values;

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
    console.error('API Error:', error);
    res.status(500).json({ message: 'Error fetching data from Google Sheets' });
  }
}
