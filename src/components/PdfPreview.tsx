// src/components/PdfPreview.tsx
'use client'; // 클라이언트 컴포넌트로 명시

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// PDFDocumentProxy 타입을 임포트합니다.
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

// pdf.js 워커 경로 설정
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

// SubmitForm에서 사용되는 컨테이너의 실제 크기 (w-32.5 -> 130px)
const CONTAINER_SIZE = 130;

export default function PdfPreview({ fileUrl }: { fileUrl: string }) {
    // [수정] 페이지의 가로/세로 비율을 저장할 state
    const [pageRatio, setPageRatio] = useState<number | null>(null);

    // [수정] pdf 객체를 받아 페이지 정보를 비동기 로드
    async function onDocumentLoadSuccess(pdf: PDFDocumentProxy): Promise<void> {
        try {
            const page = await pdf.getPage(1); // 첫 번째 페이지 가져오기
            const { width, height } = page.getViewport({ scale: 1 });
            setPageRatio(width / height); // 가로 / 세로 비율 저장
        } catch (error) {
            console.error('Failed to get PDF page info:', error);
            setPageRatio(1); // 실패 시 기본 1:1로 처리
        }
    }

    // [신규] 페이지 비율에 따라 동적으로 props를 반환하는 함수
    const getPageProps = () => {
        if (!pageRatio) {
            // 로드되기 전: 'contain' 모드로 작동 (기존과 동일)
            return { width: CONTAINER_SIZE, height: CONTAINER_SIZE };
        }

        // pageRatio > 1 이면 가로(landscape) PDF
        if (pageRatio > 1) {
            // 가로가 긴 PDF: 컨테이너의 *높이*에 맞추고 가로는 잘리게 함
            return { height: CONTAINER_SIZE };
        } else {
            // 세로가 길거나 정사각형인 PDF: 컨테이너의 *너비*에 맞추고 세로는 잘리게 함
            return { width: CONTAINER_SIZE };
        }
    };

    return (
        // [수정] flex를 이용해 내부 <Page> 컴포넌트를 중앙 정렬
        <div className='pdf-preview-container h-full w-full overflow-hidden flex items-center justify-center'>
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
                {/* [수정] 
                  - pageRatio가 로드되면 getPageProps()를 통해 width나 height 중 하나만 전달됨
                  - 로드 전에는 width/height가 둘 다 전달되어 'contain'으로 동작
                */}
                <Page pageNumber={1} {...getPageProps()} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
        </div>
    );
}
