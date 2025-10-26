export default function ProblemsSection() {
    const problems = [
        {
            id: 1,
            description: '원하는 조건으로 필터링 할 수 없다',
            selected: '22.6%',
            width: 'full',
        },
        {
            id: 2,
            description: '정보가 표준화되어 있지 않다',
            selected: '20.4%',
            width: '577px',
        },
        {
            id: 3,
            description: '가격이 애매하거나 투명하지 않다',
            selected: '20.3%',
            width: '559px',
        },
    ];

    return (
        <section id='problems-section' className='col-span-full'>
            <div className='leading-14 text-special-m-40-size font-bold mb-14'>
                <p>고객은 음악 연습실 탐색에서</p>
                <p>이러한 불편함을 드러냈습니다.</p>
            </div>
            <div className='leading-5 text-[1rem] font-normal text-gray-500 mb-4.5'>
                장기 연습실 대여 플랫폼 관련 설문조사 음악 작업실 사용자 109명 대상으로 조사했습니다.
            </div>
            <div className='w-full py-10 px-50 outline outline-gray-100 rounded-[10px] shadow-level-1 mb-14'>
                <div className='w-full flex items-center justify-center mb-10'>
                    <div className='w-10 h-10 bg-primary-400 grid place-items-center rounded-[10px] leading-7 text-[1.25rem] font-bold text-white mr-3'>
                        Q
                    </div>
                    <span className='leading-[2.45rem] text-[1.75rem] font-bold tracking-[-0.02em]'>
                        작업실을 찾으실 때 가장 불편했던 점은 무엇이었나요?
                    </span>
                </div>
                {problems.map((problem) => {
                    return (
                        <div
                            key={problem.id}
                            className={`flex justify-between mb-4 last:mb-0 py-6 px-10 rounded-[10px] leading-[33px] text-[1.375rem] ${
                                problem.id === 1 ? 'bg-primary-50' : 'bg-gray-50'
                            }`}
                            style={{ width: problem.width }}
                        >
                            <div>
                                <span className='mr-4.5 font-extrabold text-primary-600'>{problem.id}위</span>
                                <span className='font-semibold text-gray-800'>{problem.description}</span>
                            </div>
                            <span className='font-extrabold text-primary-600'>{problem.selected}</span>
                        </div>
                    );
                })}
            </div>
            <div className='flex flex-col items-center space-y-1 mb-14'>
                <div
                    className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-400
                                '
                ></div>

                <div
                    className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-200
                                '
                ></div>

                <div
                    className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-100
                                '
                ></div>
            </div>
            <div className='grid grid-cols-2 gap-5'>
                <div className='col-span-1 rounded-[10px] bg-primary-400 grid place-items-center shadow-[0_0_20px_0_rgba(138,56,245,0.2)]'>
                    <span className='my-4 font-bold text-3xl leading-9 text-white'>비효율적인 정보 탐색</span>
                    <div className='w-full py-10 text-center rounded-b-[10px] bg-white text-[1.75rem] font-medium leading-9.75 shadow-level-1'>
                        <p>이용자들은 수많은 글 속에서</p>
                        <p>필요한 정보를 찾느라 피로를 느낍니다.</p>
                    </div>
                </div>
                <div className='col-span-1 rounded-[10px] bg-primary-400 grid place-items-center shadow-[0_0_20px_0_rgba(138,56,245,0.2)]'>
                    <span className='my-4 font-bold text-3xl leading-9 text-white'>매물의 노출 한계</span>
                    <div className='w-full py-10 text-center rounded-b-[10px] bg-white text-[1.75rem] font-medium leading-9.75 shadow-level-1'>
                        <p>좋은 시설을 갖춰도, 검색되지 않으면</p>
                        <p>외면받기 쉽습니다.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
