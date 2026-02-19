import * as cheerio from 'cheerio';
import { ContentAnalysis, SEOCheck } from '../types';

export function analyzeContent($: cheerio.CheerioAPI): { analysis: ContentAnalysis; checks: SEOCheck[] } {
  const checks: SEOCheck[] = [];
  
  // 1. Text extraction (rough estimate of visible text)
  $('script, style, nav, footer, noscript').remove();
  const rawText = $('body').text().replace(/\s+/g, ' ').trim();
  const words = rawText.split(' ').filter(w => w.length > 1);
  const wordCount = words.length;

  // 2. Reading Level (Flesch-Kincaid rough approximation)
  // Simplified: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const sentences = rawText.split(/[.!?]+/).length || 1;
  const syllableCount = rawText.length / 3; // Very rough proxy
  const readingEase = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllableCount / wordCount);
  
  let readingLevel = 'Standard';
  if (readingEase < 30) readingLevel = 'Difficult';
  else if (readingEase < 60) readingLevel = 'Advanced';
  else if (readingEase > 90) readingLevel = 'Easy';

  // 3. Keyword Density (Top 1-3 word phrases)
  const keywordMap = new Map<string, number>();
  words.forEach(w => {
    const word = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (word.length > 3 && !['this', 'that', 'with', 'from', 'your', 'their'].includes(word)) {
      keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
    }
  });

  const sortedKeywords = Array.from(keywordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase, count]) => ({
      phrase,
      density: Number(((count / wordCount) * 100).toFixed(2))
    }));

  // 4. Content to HTML Ratio
  const htmlSize = $.html().length || 1;
  const contentRatio = Number(((rawText.length / htmlSize) * 100).toFixed(2));

  // --- Content Checks ---
  
  if (wordCount < 300) {
    checks.push({
      id: 'thin-content',
      severity: 'warning',
      impact: -10,
      message: `Thin content detected (${wordCount} words)`,
      recommendation: 'Aim for at least 300-500 words of high-quality content per page for better ranking.',
    });
  }

  const stuffing = sortedKeywords.filter(k => k.density > 5);
  if (stuffing.length > 0) {
    checks.push({
      id: 'keyword-stuffing',
      severity: 'warning',
      impact: -10,
      message: `Potential keyword stuffing: "${stuffing[0].phrase}" (${stuffing[0].density}%)`,
      recommendation: 'Ensure keywords flow naturally and do not exceed 2-3% of total word count.',
    });
  }

  if (contentRatio < 10) {
    checks.push({
      id: 'low-content-ratio',
      severity: 'info',
      impact: -2,
      message: `Low text-to-code ratio (${contentRatio}%)`,
      recommendation: 'A higher ratio of text to HTML can improve crawler efficiency and speed.',
    });
  }

  return {
    analysis: {
      wordCount,
      readingLevel,
      keywordDensity: sortedKeywords,
      contentRatio,
    },
    checks
  };
}
