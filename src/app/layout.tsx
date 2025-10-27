import { ToastProvider } from '@/components/ToastProvider';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    // 1. 기본 title과 description
    // (이것만 설정해도 og:title, og:description에 자동으로 반영됩니다)
    title: '뮤룸 (Muroom) | 우리들만의 음악 공간',
    description: '뮤룸에서 쉽고 빠르게 뮤지션을 위한 음악 작업실을 올려보세요.',

    // 2. Open Graph (링크 미리보기) 상세 설정
    // (이 부분을 추가하면 더 구체적으로 제어할 수 있습니다)
    openGraph: {
        title: '뮤룸 (Muroom) | 우리들만의 음악 공간',
        description: '뮤룸에서 쉽고 빠르게 뮤지션을 위한 음악 작업실을 올려보세요.',
        url: 'https://muroom.kr', // 1. 여기에 표시될 정확한 주소를 입력합니다.
        siteName: '뮤룸 (Muroom)',

        // 2. 여기에 표시될 이미지를 설정합니다. (매우 중요)
        // 이 이미지가 없으면 미리보기가 밋밋하게 보입니다.
        images: [
            {
                // 3. 'https://...'로 시작하는 전체 주소(절대 경로)여야 합니다.
                //    (예: /images/og-preview.png 같은 상대 경로는 안 됨)
                url: 'https://muroom.kr/images/screenshot.png',
                width: 1024,
                height: 576,
                alt: '뮤룸 로고',
            },
        ],
        locale: 'ko_KR',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className='scroll-smooth bg-primary-50'>
            <body className='bg-white'>
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    );
}
