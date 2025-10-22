import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className='sticky top-10 z-50 col-span-full h-20 grid place-items-center desktop:px-20 desktop:flex desktop:justify-between desktop:items-center bg-white rounded-100 row-start-1'>
            <Image src='/images/logo/logo.png' alt='muroom logo' width={128} height={25} />
            <Link
                href='#submit-form'
                className='hidden desktop:grid place-items-center w-[125px] h-9 text-base-m-14-2 text-white bg-primary-600 rounded-8'
            >
                내 작업실 등록하기
            </Link>
        </header>
    );
}
