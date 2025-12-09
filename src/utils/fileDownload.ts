import html2canvas from 'html2canvas';

/**
 * 헬퍼: 파일 다운로드
 */
export const downloadFile = (content: string, fileName: string): void => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

/**
 * 헬퍼: 이미지로 다운로드
 */
export const downloadAsImage = async (element: HTMLElement, fileName: string = 'screenshot.png'): Promise<void> => {
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            logging: false,
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('이미지 생성 중 오류 발생:', error);
    }
};
