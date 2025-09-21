import { google } from 'googleapis';

export function getSheets() {
  const cid = (process.env.GOOGLE_OAUTH_CLIENT_ID || '').trim();
  const csec = (process.env.GOOGLE_OAUTH_CLIENT_SECRET || '').trim();
  const rt = (process.env.GOOGLE_OAUTH_REFRESH_TOKEN || '')
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/\s+/g, '');

  if (!cid || !csec || !rt) {
    throw new Error(
      'Google OAuth env missing. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN'
    );
  }

  const oauth2 = new google.auth.OAuth2(
    cid,
    csec,
    'http://localhost:5555/oauth2callback' // only used when minting the token locally
  );
  oauth2.setCredentials({ refresh_token: rt });
  return google.sheets({ version: 'v4', auth: oauth2 });
}

export function cfg() {
  const spreadsheetId = (process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '').trim();
  const tab = (process.env.GOOGLE_SHEETS_TAB_NAME || 'Leads').trim(); // default if none supplied
  if (!spreadsheetId) {
    throw new Error('Missing env GOOGLE_SHEETS_SPREADSHEET_ID');
  }
  return { spreadsheetId, tab };
}
