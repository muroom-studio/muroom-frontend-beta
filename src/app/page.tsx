import Image from 'next/image';

export default function Home() {
    // useEffect(() => {
    //     router.push('/submit-room');
    // }, [router]);
    return (
        <div className='select-none whitespace-pre-line break-keep text-center'>
            <div className='hidden desktop:flex min-h-screen items-center'>
                <div className='absolute top-0 h-21 w-full border-gray-300 border-b flex px-5'>
                    <Image src='/images/logo/logo.svg' alt='muroom' width={133} height={32} />
                </div>
                <div className='w-full flex flex-col items-center'>
                    <Image src='/images/icons/cone-icon.svg' alt='Logo' width={133} height={32} className='mb-10' />
                    <h1 className='text-super mb-5'>현재 서비스 준비 중입니다.</h1>

                    <div className='text-gray-800 text-2xl text-center leading-[32px] tracking-[-0.02em]'>
                        <p>이용에 불편을 드려 죄송합니다.</p>
                        <p>더 나은 서비스 제공을 위해 준비 중에 있습니다.</p>
                        <p>빠른 시일 내에 준비하여 찾아뵙도록 하겠습니다.</p>
                    </div>
                </div>
            </div>
            <div className='desktop:hidden flex flex-col min-h-screen items-center justify-center px-5'>
                <div className='absolute top-10 flex items-center justify-center'>
                    <Image src='/images/logo/logo.svg' alt='muroom' width={133} height={32} />
                </div>
                <div className='w-full flex flex-col items-center'>
                    <Image src='/images/icons/cone-icon.svg' alt='Logo' width={133} height={32} className='mb-10' />
                    <h1 className='text-[28px] font-bold leading-[39px] tracking-tight mb-4'>
                        현재 서비스 준비중입니다.
                    </h1>

                    <div className='text-gray-800 text-[16px] text-center leading-[22px] tracking-tight'>
                        <p>이용에 불편을 드려 죄송합니다.</p>
                        <p>더 나은 서비스 제공을 위해 준비 중에 있습니다.</p>
                        <p>빠른 시일 내에 준비하여 찾아뵙도록 하겠습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
