/**
 * Calculate reading time for content
 * Based on average reading speeds:
 * - Korean: 300 characters per minute
 * - English: 200 words per minute
 */
export function calculateReadingTime(content: string): string {
  // Count Korean characters
  const koreanChars = (content.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g) || []).length;

  // Count English words
  const englishWords = (content.match(/\b[a-zA-Z]+\b/g) || []).length;

  // Calculate reading time
  const koreanTime = koreanChars / 300; // 분당 300자
  const englishTime = englishWords / 200; // 분당 200단어

  const totalMinutes = Math.ceil(koreanTime + englishTime);

  // Return formatted string
  if (totalMinutes < 1) {
    return '1분';
  }

  return `${totalMinutes}분`;
}
