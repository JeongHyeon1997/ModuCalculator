/**
 * 유틸리티: 숫자 포맷팅 (콤마 추가)
 */
export const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('ko-KR').format(Math.floor(num));
};

/**
 * 유틸리티: 콤마 제거 후 숫자로 변환
 */
export const parseNumber = (str: string | number): number => {
    if (!str) return 0;
    return Number(str.toString().replace(/,/g, ''));
};
