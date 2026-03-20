
import "../styles/SectionLogotype.scss";
import Image from 'next/image';
import useIsMobile from '@/utils/useIsMobile';
import BrandTitle from "./BrandTitle";
import { useEffect, useRef, useState } from "react";


export default function SectionLogotype() {

    const device = useDeviceType();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const getVideoSrc = () => {
        switch (device) {
            case "mo":
            return "/workout-v2/videos/video_character-mo.mp4";
            case "tab":
            return "/workout-v2/videos/video_character-tab.mp4";
            default:
            return "/workout-v2/videos/video_character-pc.mp4";
        }
    };



    function useDeviceType() {
        const [device, setDevice] = useState<"pc" | "tab" | "mo">("pc");

        useEffect(() => {
            const update = () => {
                if (window.innerWidth <= 767) {
                    setDevice("mo");
                } else if (window.innerWidth <= 1024) {
                    setDevice("tab");
                } else {
                    setDevice("pc");
                }
            };
            update();
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }, []);

        return device;
    }

    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if (!containerRef.current || !videoRef.current) return;

        const video = videoRef.current;

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
            });
        },
        { threshold: 0.01 }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, [device]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [device]);

    return (
        <section className="section-logo">

            <div className="l-inner">


                <div>
                    <BrandTitle title={'Logotype'} desc={'‘리본’끈을 활용한 시그니처 로고로서, 심볼로고인 ‘R’을 회전하여 국문형 로고의 타이포 ‘리’를 표현하고 있습니다.'} />
                </div>

                <div className="l-type" data-aos="fade-up">
                    <div className="l-type_item kr">
                        <span className="lang">KR</span>
                        <Image src={
                            isMobile ?
                                '/workout-v2/images/contents/logo_brand_kr-mo.png' :
                                '/workout-v2/images/contents/logo_brand_kr-pc.png'}
                            alt={''}
                            width={isMobile ? 246 : 432} height={isMobile ? 98 : 173} />
                    </div>
                    <div className="l-type_item en">
                        <span className="lang">EN</span>
                        <Image src={
                            isMobile ?
                                '/workout-v2/images/contents/logo_brand_en-mo.png' :
                                '/workout-v2/images/contents/logo_brand_en-pc.png'}
                            alt={''}
                            width={isMobile ? 276 : 484} height={isMobile ? 88 : 153} />
                    </div>
                </div>


                <div className="l-grid">
                    
                    <div className="l-head">
                        <div className="title">Logo grid system</div>
                        <p className="desc">로고의 안정감 있는 인식을 위해, 로고 사용 시 여백과 가이드라인을 지켜주어야 합니다.<br/>안정 영역에는 다른  개체가 들어갈 수 없습니다.</p>
                    </div>

                    <div className="l-img" data-aos="fade-up">
                        <Image src={
                            isMobile ?
                                '/workout-v2/images/contents/img_brand_grid-mo.png' :
                                '/workout-v2/images/contents/img_brand_grid-pc.png'}
                            alt={''}
                            width={isMobile ? 400 : 1920} height={isMobile ? 775 : 840} />
                    </div>

                </div>


                <div className="l-brand">
                    
                    <div className="l-head">
                        <div className="title">Brand Color</div>
                        <p className="desc"><span className="purple">Purple Reborn</span>은 리본회생을 대표하는 색상입니다.<br/>브랜드 컬러는 절대 변형할 수 없습니다.</p>
                    </div>

                    <div className="l-img" data-aos="fade-up">
                        <Image src={
                            isMobile ?
                                '/workout-v2/images/contents/img_brand_color-mo.png' :
                                '/workout-v2/images/contents/img_brand_color-pc.png'}
                            alt={''}
                            width={isMobile ? 320 : 987} height={isMobile ? 142 : 334} />
                    </div>

                </div>

                <div className="l-character" ref={containerRef}>
                    
                    {/* <div className="l-head">
                        <div className="title">Character</div>
                        <p className="desc" data-aos="fade-up"><span className="purple">리봄이</span>는 리본회생을 대표하는 캐릭터입니다.</p>
                    </div> */}

                    <div className="character-desc" data-aos="fade-up">
                        희망을 전하는 리본회생의 여정은<br/>오늘도 계속됩니다.
                    </div>

                    <div className="l-video" data-aos="fade-up">
                        <video
                            ref={videoRef}
                            muted
                            // loop
                            playsInline
                            preload="auto"
                            style={{ width: "100%", height: "auto" }}
                        >
                            <source src={getVideoSrc()} type="video/mp4" />
                        </video>
                    </div>

                </div>

            </div>

        </section>
    )
}