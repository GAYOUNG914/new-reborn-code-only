
import "../styles/SectionHistory.scss";
import Image from 'next/image';
import useIsMobile from '@/utils/useIsMobile';
import BrandTitle from "./BrandTitle";


export default function SectionHistory() {

    const isMobile = useIsMobile();

    return (
        <section className="section-history">
         
            <div>
                <BrandTitle title={'History'} />
            </div>

            <div className="h-inner">
                <div className="h-line">
                    <Image src={
                        isMobile ?
                            '/workout-v2/images/contents/img_brand_history_line-mo.png' :
                            '/workout-v2/images/contents/img_brand_history_line-pc.png'
                    }
                        alt={''}
                        width={isMobile ? 900 : 20} height={isMobile ? 877 : 1115} />
                </div>

                <div className="h-list">
                    <div className="h-item" data-aos="fade-up">
                        <div className="h-contents">
                            <div className="title">리본회생 1.0 Brand Launching</div>
                            <ul>
                                <li>개인회생 서비스 중심의 실무형 구조</li>
                                <li>실버, 블루, 퍼플 3가지의 서비스 상품 론칭</li>
                            </ul>
                        </div>
                    </div>

                    <div className="h-item" data-aos="fade-up">
                        <div className="h-contents">
                            <div className="title">리본회생 2.0 Visual Branding</div>
                            <ul>
                                <li>리브랜딩 및 정체성 강화</li>
                                <li>로고/디자인 전면 개편</li>
                                <li>시각적 브랜딩 강화<small> (글래스모피즘, 그래픽 중심)</small></li>
                                <li>슬로건 도입 <small>(Beter Life For You 내 삶을 가치있게)</small></li>
                                <li>퍼플플러스 프리미엄 서비스 상품 개발</li>
                            </ul>

                            <div className="h-box">
                                <div className="title">2.1 System Reinforcement</div>
                                <ul>
                                    <li>CRM 프로그램 도입 및 CX 개편</li>
                                    <li>CS R&R 개편 및 서비스 정체성 강화</li>
                                    <li>Goods Launching</li>
                                    <li>그린리본 서비스 고도화</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="h-item" data-aos="fade-up">
                        <div className="h-contents">
                            <div className="title">리본회생 3.0 Emotional Branding</div>
                            <ul>
                                <li>감정 중심 스토리텔링</li>
                                <li>고객과 함께 걷는 브랜드로 포지셔닝</li>
                                <li>슬로건 리뉴얼 (새로운 삶을 선물하다) </li>
                                <li>브랜드 철학·스토리 중심 전환</li>
                                <li>고객 공감 콘텐츠 확대</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}