// scripts/get-google-refresh-token.ts
import http from 'http';
import open from 'open';
import { google } from 'googleapis';

const CLIENT_ID     = process.env.GOOGLE_OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const REDIRECT_URI  = 'http://localhost:5555/oauth2callback';

(async () => {
  const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  console.log('Open this URL to authorize:\n', authUrl, '\n');
  await open(authUrl);

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '', REDIRECT_URI);
    const code = url.searchParams.get('code');
    if (!code) { res.end('Missing code'); return; }

    try {
      const { tokens } = await oauth2.getToken(code);
      console.log('\nREFRESH TOKEN:\n', tokens.refresh_token, '\n');
      res.end('You can close this tab. Refresh token printed in the console.');
    } catch (e: any) {
      console.error(e);
      res.end('Error exchanging code.');
    } finally {
      server.close();
    }
  }).listen(5555, () => console.log('Waiting on http://localhost:5555/oauth2callback'));
})();
