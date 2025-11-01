export default function Footer() {
    return (
        <footer className='w-full px-4 desktop:px-20 pt-5 pb-15'>
            <h2 className='text-base-m-14-2 text-gray-500 mb-3'>(주) 뮤룸</h2>

            <table className='text-base-s-12-1 text-gray-500 mb-5'>
                <tbody>
                    <tr>
                        <td className='w-21.5'>대표이사</td>
                        <td>김태환</td>
                    </tr>
                    <tr className='h-2'></tr>
                    <tr>
                        <td className='w-21.5'>사업자 등록번호</td>
                        <td>588-01-03784</td>
                    </tr>
                    <tr className='h-2'></tr>
                    <tr>
                        <td className='w-21.5'>사업자 소재지</td>
                        <td>서울특별시 성북구 서경로 124, 유담관동 16층 E-2호</td>
                    </tr>
                    <tr className='h-2'></tr>
                    <tr>
                        <td className='w-21.5'>이메일</td>
                        <td>contact@muroom.kr</td>
                    </tr>
                </tbody>
            </table>

            <span className='text-base-s-12-1 text-gray-500'>2025 muroom inc. all rights reserved.</span>
        </footer>
    );
}
