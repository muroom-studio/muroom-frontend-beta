/**
 * Presigned URL 요청 시 각 파일에 대한 정보
 */
export interface FileUploadRequest {
    type: 'BETA_PROPERTY'; // 현재는 BETA_PROPERTY로 고정
    fileName: string;
    contentType: string; // 예: 'image/jpeg', 'application/pdf'
}

/**
 * Presigned URL 응답 데이터의 각 항목
 */
export interface PresignedUrlData {
    url: string; // 파일을 업로드할 S3 presigned PUT URL
    fileKey: string; // S3에 저장될 파일의 키 (경로 포함)
}

/**
 * Presigned URL 요청에 대한 API 응답 구조
 */
export interface GetPresignedUrlResponse {
    status: number;
    message: string;
    data: {
        presignedUrls: PresignedUrlData[];
    };
}

/**
 * 최종 폼 제출 시 이미지 파일 키 목록
 */
export interface IntroductoryImageFileKey {
    fileKey: string;
}

/**
 * 최종 폼 제출 요청 바디
 */
export interface SubmitRegistrationRequest {
    name: string;
    phoneNumber: string;
    thirdPartyUrl: string;
    agreedToPrivacy: boolean;
    featureSuggestions: string;
    introductoryImageFileKeys: string[]; // Presigned URL 응답에서 받은 fileKey 목록
}

/**
 * 최종 폼 제출에 대한 API 응답 구조 (예시)
 */
export interface SubmitRegistrationResponse {
    status: number;
    message: string;
    data?: unknown; // 실제 응답 데이터 구조에 따라 변경
}

/**
 * 일반적인 API 에러 응답 구조 (예시)
 */
export interface ApiErrorResponse {
    status: number;
    error: string;
    message?: string;
}

/**
 * 문의하기 폼 제출 요청 바디
 */
export interface SubmitInquiryRequest {
    name: string;
    phoneNumber: string;
    content: string;
    agreedToPrivacy: boolean;
}

/**
 * 문의하기 폼 제출에 대한 API 응답 구조 (예시)
 */
export interface SubmitInquiryResponse {
    status: number;
    message: string;
    data?: unknown; // 실제 응답 데이터 구조에 따라 변경
}
