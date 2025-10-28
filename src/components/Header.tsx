import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <header className='fixed w-306 min-w-306 px-25 z-50 top-10'>
            <div className='w-full h-20 px-20 flex justify-between items-center bg-white rounded-100 shadow-level-1'>
                <Image src='/images/logo/logo.png' alt='muroom logo' width={128} height={25} />
                <Link
                    href='#submit-form'
                    className='grid place-items-center w-[125px] h-9 text-base-m-14-2 text-white bg-primary-600 rounded-8'
                >
                    내 작업실 등록하기
                </Link>
            </div>
        </header>
    );
}
