import './globals.css';
import type { Metadata } from 'next';
import { pretendard } from '@/styles/fonts';

export const metadata: Metadata = {
    title: 'muroom',
    description: '새로운 음악 연습실 대여 플랫폼, 뮤룸 (muroom)',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className='scroll-smooth bg-primary-50'>
            <body className={`${pretendard.variable} bg-white`}>{children}</body>
        </html>
    );
}
