/**
 * 날짜 포맷팅 유틸리티
 *
 * Date 객체를 다양한 형식의 문자열로 변환합니다.
 */

/**
 * Date를 한국어 전체 형식으로 포맷
 * 예: 2025년 1월 19일
 *
 * @param date Date 객체
 * @returns 포맷된 날짜 문자열
 */
export function formatDateFull(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Date를 짧은 형식으로 포맷
 * 예: 2025.01.19
 *
 * @param date Date 객체
 * @returns 포맷된 날짜 문자열
 */
export function formatDateShort(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * Date를 ISO 형식으로 포맷
 * 예: 2025-01-19
 *
 * @param date Date 객체
 * @returns ISO 포맷 날짜 문자열
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 두 날짜 사이의 일수 차이 계산
 *
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 일수 차이
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 상대 시간 표시 (예: "3일 전", "2개월 전")
 *
 * @param date 날짜
 * @returns 상대 시간 문자열
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInDays === 0) return '오늘';
  if (diffInDays === 1) return '어제';
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;
  return `${diffInYears}년 전`;
}
