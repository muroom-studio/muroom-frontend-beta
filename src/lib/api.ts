'use server';
// src/lib/api.ts

import {
    FileUploadRequest,
    GetPresignedUrlResponse,
    SubmitRegistrationRequest,
    SubmitRegistrationResponse,
    ApiErrorResponse,
    SubmitInquiryRequest,
    SubmitInquiryResponse,
    GetRegistrationCountResponse,
} from '../types/api';

/**
 * API 요청을 위한 범용 fetcher 함수
 */
async function apiFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${process.env.API_BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.message || 'API 요청 실패');
    }

    return response.json();
}

export async function getRemainingCount() {
    const TOTAL_SLOTS = 54;

    const response = await apiFetcher<GetRegistrationCountResponse>('/api/beta/registrations/counts', {
        method: 'GET',
        next: { revalidate: 0 },
    });

    return TOTAL_SLOTS - response.data.totalRegistrations;
}

/**
 * Presigned URL을 요청하는 함수
 * @param fileRequests 업로드할 파일들의 정보 (fileName, contentType)
 * @returns Presigned URL 목록과 fileKey 목록
 */
export async function getPresignedUrls(
    fileRequests: FileUploadRequest[]
): Promise<GetPresignedUrlResponse['data']['presignedUrls']> {
    const response = await apiFetcher<GetPresignedUrlResponse>('/api/beta/registrations/presigned-url', {
        method: 'POST',
        body: JSON.stringify({ fileUploadRequests: fileRequests }),
    });
    return response.data.presignedUrls;
}

/**
 * Presigned URL을 사용하여 S3에 파일을 업로드하는 함수
 * @param presignedUrl S3에 파일을 PUT할 presigned URL
 * @param file 업로드할 File 객체
 */
// export async function uploadFileToS3(presignedUrl: string, file: File): Promise<void> {
//     // S3에 직접 업로드하는 것이므로 API_BASE_URL을 사용하지 않고 전체 URL 사용
//     const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': file.type, // 파일의 실제 MIME 타입
//         },
//         body: file,
//     });

//     if (!response.ok) {
//         throw new Error(`S3 파일 업로드 실패: ${response.statusText}`);
//     }
// }

/**
 * 최종 폼 데이터를 제출하는 함수
 * @param data 제출할 폼 데이터
 */
export async function submitRegistration(data: SubmitRegistrationRequest): Promise<SubmitRegistrationResponse> {
    return apiFetcher<SubmitRegistrationResponse>('/api/beta/registrations', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * 문의하기 폼 데이터를 제출하는 함수
 * @param data 제출할 문의 데이터
 */
export async function submitInquiry(data: SubmitInquiryRequest): Promise<SubmitInquiryResponse> {
    return apiFetcher<SubmitInquiryResponse>('/api/beta/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
