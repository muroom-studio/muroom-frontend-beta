// src/components/PdfPreview.tsx
'use client'; // 클라이언트 컴포넌트로 명시

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// v10에서는 CSS 임포트가 필요 없을 수 있습니다. 문제가 발생하면 다시 확인합니다.

// pdf.js 워커 경로 설정 (이 부분은 여전히 필요합니다)
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export default function PdfPreview({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className='pdf-preview-container h-full w-full overflow-hidden rounded-md'>
            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className='flex h-full w-full items-center justify-center bg-gray-100 text-xs'>
                        PDF 로딩 중...
                    </div>
                }
                error={
                    <div className='flex h-full w-full items-center justify-center bg-red-100 text-xs text-red-600'>
                        PDF 로드 실패
                    </div>
                }
            >
                <Page pageNumber={1} width={110} height={110} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
        </div>
    );
}
