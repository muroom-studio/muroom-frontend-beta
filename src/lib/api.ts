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

interface ApiFetcherOptions extends RequestInit {
    timeout?: number; // milliseconds
}

/**
 * API 요청을 위한 범용 fetcher 함수
 */
async function apiFetcher<T>(url: string, options?: ApiFetcherOptions): Promise<T> {
    const { timeout, ...fetchOptions } = options || {}; // options에서 timeout을 분리

    const controller = new AbortController();

    const effectiveTimeout = timeout ?? 15000; // 기본 타임아웃 15초 설정

    let timeoutId: NodeJS.Timeout | undefined; // NodeJS 환경을 위한 타입 힌트
    if (effectiveTimeout > 0) {
        timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions?.headers,
            },
            ...fetchOptions,
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData: ApiErrorResponse = await response.json();
            throw new Error(errorData.message || 'API 요청 실패');
        }

        return response.json();
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('요청이 시간 초과로 인해 중단되었습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
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
