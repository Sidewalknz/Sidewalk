// Lists all worksheet titles in the spreadsheet
import { getSheets, cfg } from '../../../../../lib/googleSheets';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sheets = getSheets();
    const { spreadsheetId } = cfg();
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const titles =
      meta.data.sheets
        ?.map((s) => s.properties?.title)
        .filter((t): t is string => !!t) || [];
    return Response.json(titles);
  } catch (e: any) {
    return new Response(`Sheets tabs failed: ${e?.message || e}`, { status: 500 });
  }
}
