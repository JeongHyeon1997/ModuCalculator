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
