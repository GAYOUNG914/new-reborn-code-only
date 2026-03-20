import "../styles/SectionKv.scss";
import Link from "next/link";
import Image from "next/image";
import { getLenis } from "@/utils/lenis";

import { KvData } from "@/data/post/KvData";

import heroDataImgBg from "@/app/assets/images/contents/post_kv_hero_bg.png";

const lenis = getLenis();

// 스크롤 함수
const scrollToSection = (sectionClass: string) => {
  const section = document.querySelector(sectionClass);
  if (section) {
    lenis?.stop()
    section.scrollIntoView({ behavior: 'smooth' });
    lenis?.start();
  }
};

export default function SectionKv() {
  return (
    <section className="section-kv">
      <div className="section-kv_container">
        <div className="section-kv_left">
          <div className="section-kv_left_title">
            <p className="subtitle s1_n" data-aos="fade-up" data-aos-delay="100">리본회생이 바라보는</p>
            <h3 className="heading h4_n" data-aos="fade-up" data-aos-delay="200">세상의 이야기</h3>
          </div>
          <div className="section-kv_right mo-only" data-aos="fade-up" data-aos-delay="300">
            {/* section 이미지 컨텐츠 :: MOBILE */}
            <div className="section-kv_right_hero">
              <div className="inner">
                <div className="data-center-wrapper">
                  <div className="texts">
                    <p className="texts_title">
                      {KvData.result.firstLayout.mainText}
                    </p>
                    <p className="texts_subtitle">
                      {KvData.result.firstLayout.subText}
                    </p>
                  </div>
                  <div className="date">
                    {KvData.result.firstLayout.date}
                  </div>
                  <div className="bg_image">
                    <Image
                      src={KvData.result.firstLayout.innerImageUrl}
                      alt="리본회생이 바라보는 세상의 이야기"
                      width={483}
                      height={555}
                    />
                  </div>
                </div>
                <div className="data-text-wrapper">
                  <p className="mo-only text01">리본회생이 바라보는 세상의 이야기</p>
                  <p className="month text02">
                    {KvData.result.firstLayout.dateEng}
                  </p>
                  <p className="mo-only text03">Monthly Stories</p>
                  <div className="mo-only text04">
                    <p>{KvData.result.firstLayout.subText}</p>
                    <div className="line"></div>
                    <p>{KvData.result.firstLayout.date}</p>
                  </div>
                </div>
              </div>
              <div className="hero_bg_image">
                <Image
                  src={heroDataImgBg}
                  alt="리본회생이 바라보는 세상의 이야기"
                  width={526}
                  height={700}
                />              
              </div>
            </div>
          </div>          
          <nav className="section-kv_left_navigation">
            <div className="section-kv_left_nav-item" data-aos="fade-up" data-aos-delay="300">
              <button className="nav-button" onClick={() => scrollToSection('.section-insight')}>ARTICLE</button>
              <p className="nav-label b2_n">리본 인사이트</p>
            </div>
            <div className="section-kv_left_nav-item" data-aos="fade-up" data-aos-delay="350">
              <button className="nav-button" onClick={() => scrollToSection('.section-library')}>BOOK</button>
              <p className="nav-label b2_n">리본 라이브러리</p>
            </div>
            <div className="section-kv_left_nav-item" data-aos="fade-up" data-aos-delay="400">
              <button className="nav-button" onClick={() => scrollToSection('.section-toon')}>TOON</button>
              <p className="nav-label b2_n">리본툰</p>
            </div>
          </nav>
        </div>
        <div className="section-kv_right pc-tablet-only" data-aos="fade-up" data-aos-delay="200">
        {/* section 이미지 컨텐츠 :: PC */}
          <div className="section-kv_right_hero">
            <div className="inner">
              <div className="data-center-wrapper">
                <div className="texts">
                  <p className="texts_title">
                    {KvData.result.firstLayout.mainText}
                  </p>
                  <p className="texts_subtitle">
                    {KvData.result.firstLayout.subText}
                  </p>
                </div>
                <div className="date">
                  {KvData.result.firstLayout.date}
                </div>
                <div className="bg_image">
                  <Image
                    src={KvData.result.firstLayout.innerImageUrl}
                    alt="리본회생이 바라보는 세상의 이야기"
                    width={483}
                    height={555}
                  />
                </div>
              </div>
              <div className="data-text-wrapper">
                <p className="mo-only text01">리본회생이 바라보는 세상의 이야기</p>
                <p className="month text02">{KvData.result.firstLayout.dateEng}</p>
                <p className="mo-only text03">Monthly Stories</p>
                <div className="mo-only text04">
                  <p>{KvData.result.firstLayout.subText}</p>
                  <div className="line"></div>
                  <p>{KvData.result.firstLayout.date}</p>
                </div>
              </div>
            </div>
            <div className="hero_bg_image">
              <Image
                src={heroDataImgBg}
                alt="리본회생이 바라보는 세상의 이야기"
                width={526}
                height={700}
              />              
            </div>
          </div>
        </div>
      </div>
      <div className="section-kv_bg" data-aos="fade-in" >
        <Image 
          src={KvData.result.firstLayout.outterImageUrl} 
          alt="리본회생이 바라보는 세상의 이야기" 
          width={1920}
          height={1080}
          className="section-kv_bg-image pc-tablet-only"
        />
        <Image 
          src={KvData.result.firstLayout.outterImageUrlMo} 
          alt="리본회생이 바라보는 세상의 이야기" 
          width={1920}
          height={1080}
          className="section-kv_bg-image mo-only"
        />        
      </div>
    </section>
  );
}