'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Step {
    content: string;
    detailedContent: string;
}
interface FAQ {
    question: string;
    details: string;
    steps: Step[];
}
// $muroom_new_line 만나면 개행

const faqs: FAQ[] = [
    // faqs: FAQ[] 배열에 이 3개의 객체를 추가하세요.

    {
        question: '등록은 무료인가요?',
        details: `네, 매물을 플랫폼에 등록하는 것 자체는 100% 무료입니다.

            뮤룸은 기본적으로 매물을 등록하고, 고객이 이를 찾고 정보를 제공받는 모든 과정에서 별도의 비용을 받지 않습니다. 다만, 더 많은 노출을 원하시는 임대인분들을 위해 광고 요금제가 별도로 마련되어 있으며, 이 광고 요금제를 이용하시는 경우에만 추가 금액이 발생합니다.`,
        steps: [],
    },
    {
        question: '등록 후 매물 관리는 어떻게 할 수 있나요?',
        details: `사장님께서 최대한 편리하게 매물을 등록하고 관리하실 수 있도록 2가지 방법을 준비했습니다.
        
        `,
        steps: [
            {
                content: '직접 관리 기능 (선택)',
                detailedContent:
                    '물론, 급하게 수정할 내용이 있거나 저희의 자동 추적 시점과 상관없이 바로 변경하고 싶으실 경우를 대비하여, 매물별로 간편하게 수정 가능한 링크를 따로 제공해 드립니다. 이 링크를 통해 사장님께서 언제든지 원하실 때 직접 정보를 수정하고 업데이트하실 수 있습니다.',
            },
            {
                content: '자동 관리',
                detailedContent:
                    '매물 등록 후, 저희는 사장님께서 제공해주신 원래 링크를 일주일 간격으로 추적하며, 만약 해당 링크에서 월세, 공실 여부 등 정보가 수정된 것이 확인되면, 뮤룸 매물 정보도 자동으로 업데이트하여 최신 상태를 유지합니다.',
            },
            {
                content: '정산 및 통계 확인',
                detailedContent:
                    '기간별 예약 건수와 발생한 매출, 정산 내역을 투명하게 확인하고 엑셀 파일로 다운로드할 수 있습니다.',
            },
        ],
    },
    {
        question: '광고 혜택을 받는다면 어떤식으로 노출되나요?',
        details: `뮤룸의 광고 시스템은 사장님의 매물이 최우선으로 주목받을 수 있도록 다양한 영역에서 가장 눈에 띄게 노출됩니다.
        
        `,
        steps: [
            {
                content: '메인 화면 및 리스트 최우선 노출',
                detailedContent:
                    '고객이 뮤룸 접속 후 처음 보는 메인 화면의 매물 리스트에서 사장님의 광고 매물이 고정적으로 우선 노출됩니다.',
            },
            {
                content: '지도 검색 시 우위 확보',
                detailedContent:
                    '축적별로 제공되는 지도 화면에서 광고 시스템이 적용된 매물은 일반 매물보다 우선적으로 눈에 띄게 노출됩니다.',
            },
            {
                content: '지역 검색 시 즉각적인 주목',
                detailedContent:
                    '고객이 필터링을 설정하지 않은 상태로 특정 지역을 검색할 경우, 검색 결과 첫 번째 화면 맨 처음 상단에 사장님의 매물이 띄워집니다.',
            },
            {
                content: '알고리즘 기반 추천 최적화',
                detailedContent:
                    '고객의 검색 기록이나 관심사 등 알고리즘에 의해 검색되는 매물 순위에서 사장님의 매물을 최상단에 위치시킵니다.',
            },
        ],
    },
    {
        question: '가격 정보를 꼭 제공해야 하나요?',
        details: `가격 정보 노출 여부는 사장님께서 최종적으로 선택하실 수 있습니다.
        다만, 저희 뮤룸은 '공정한 작업실 거래'라는 브랜드 철학에 따라 가격 공개를 강력히 권장드립니다.
        
        가격 공개를 권장하는 시스템적인 이유는 다음과 같습니다
        
        `,
        steps: [
            {
                content: '신속한 고객 접근',
                detailedContent:
                    '가격을 공개했을 때, 고객은 필터링 없이도 매물의 적합성을 빠르게 판단할 수 있어 사장님의 매물에 조금 더 빠르게 접근하게 됩니다.',
            },
            {
                content: '시스템 상 노출 극대화',
                detailedContent:
                    '저희 뮤룸 시스템은 고객이 매물을 필터링하거나 가격대별로 검색할 때, 가격이 공개된 매물을 우선순위로 보이도록 설계되어 있습니다. 따라서 가격을 공개하실 경우 매물 노출 효과를 극대화시킬 수 있습니다.',
            },
        ],
    },
    {
        question: '부정적인 후기나 허위 사실은 어떻게 관리되나요?',
        details: `저희 뮤룸은 투명성을 위해 자유로운 후기 작성을 지향합니다. 하지만 허위 사실이나 악의적인 글로 인해 사장님께서 피해를 입으시는 일이 없도록 엄격하게 관리하고 있습니다.
        
        후기 관리 시스템은 다음과 같습니다.\n\n`,
        steps: [
            {
                content: '신고하기 시스템 운영',
                detailedContent:
                    '사장님 또는 다른 사용자가 해당 후기가 허위 사실이라고 신고하는 경우, 즉시 저희 운영팀이 내용을 접수합니다.',
            },
            {
                content: '엄격한 대질 조사 및 검토',
                detailedContent:
                    '신고 접수된 후기에 대해 허위 사실 여부를 확인하는 대질 조사 및 검토 과정을 엄격하게 거칩니다.',
            },
            {
                content: '신속한 조치',
                detailedContent:
                    '부정적인 후기들이 지속적으로 달리거나, 하나의 IP에서 의심스러운 정황(반복적인 비방 등)이 파악될 경우, 저희 운영팀이 신속하게 조치를 취하도록 할 것입니다.',
            },
        ],
    },
];

const FAQItem = ({ faq, isOpened, onClick }: { faq: FAQ; isOpened: boolean; onClick: () => void }) => {
    return (
        <div className='mb-6 last:mb-0'>
            <div
                id='question'
                className={`border bg-white rounded-20 transition-all duration-300 ease-in-out cursor-pointer
                    ${isOpened ? 'border-gray-600 shadow-level-0' : 'border-gray-200'}
                `}
                onClick={onClick}
            >
                <div className='px-5 desktop:px-15 py-4 desktop:py-6.75 flex items-center justify-between'>
                    <span className='leading-[150%] text-[1rem] desktop:text-2xl font-semibold text-gray-700'>
                        {faq.question}
                    </span>
                    <Image
                        src='/images/icons/up-arrow-icon.svg'
                        alt={!isOpened ? '답변 보기' : '답변 닫기'}
                        width={36}
                        height={36}
                        className={`hidden desktop:block transition-transform duration-300 ease-in-out w-9 h-9 ${
                            isOpened ? 'rotate-0' : 'rotate-180'
                        }`}
                    />
                    <Image
                        src='/images/icons/up-arrow-icon.svg'
                        alt={!isOpened ? '답변 보기' : '답변 닫기'}
                        width={24}
                        height={24}
                        className={`desktop:hidden transition-transform duration-300 ease-in-out w-6 h-6 ${
                            isOpened ? 'rotate-0' : 'rotate-180'
                        }`}
                    />
                </div>
            </div>

            <div
                id='answer'
                className={`grid overflow-hidden transition-all ease-in-out
                    ${isOpened ? 'grid-rows-[1fr] opacity-100 duration-300' : 'grid-rows-[0fr] opacity-0 duration-500'}
                `}
            >
                <div className='overflow-hidden'>
                    <div className='px-4 desktop:px-15 py-4 destkop:py-6 leading-[150%] text-[14px] desktop:text-[20px] font-medium text-gray-600 whitespace-pre-line break-keep'>
                        <p>{faq.details}</p>
                        <ul className='space-y-4'>
                            {faq.steps.map((step, index) => (
                                <li key={index} className='flex'>
                                    <span className='mr-2'>{index + 1}.</span>
                                    <div>
                                        <p>{step.content}</p>
                                        <p>: {step.detailedContent}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FAQSection() {
    const [openedIndexes, setOpenedIndexes] = useState<number[]>([]);

    const handleToggle = (index: number) => {
        if (openedIndexes.includes(index)) {
            // 이미 열려있다면, 해당 인덱스를 배열에서 제거합니다 (닫기)
            setOpenedIndexes(openedIndexes.filter((i) => i !== index));
        } else {
            // 닫혀있다면, 해당 인덱스를 배열에 추가합니다 (열기)
            setOpenedIndexes([...openedIndexes, index]);
        }
    };

    return (
        <section
            id='qna-section'
            className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25 mb-10 desktop:mb-50'
        >
            <div className='mb-10 desktop:mb-14 leading-[150%] text-2xl desktop:text-[42px] font-semibold text-gray-800'>
                <p>빠른 문의사항</p>
            </div>
            <div className='space-y-4'>
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        faq={faq}
                        isOpened={openedIndexes.includes(index)}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </section>
    );
}
