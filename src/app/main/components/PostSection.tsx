import "../styles/PostSection.scss";
import Link from "next/link";
import Image from "next/image";

import { KvData } from "@/data/post/KvData";
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';
import Title from "./Title";

import heroDataImgBg from "@/app/assets/images/contents/post_kv_hero_bg.png";
import bgImg from "@/app/assets/images/contents/bg_main_post.png";
import bgImgMo from "@/app/assets/images/contents/bg_main_post_m.png";


export default function PostSection() {
  return (
    <section className="post-section">
      <div className="post-section_container">
        <div className="post-section_left">
          <div className="post-section_left_title">
            <Title 
            title="세상의 이야기" 
            desc="리본회생이 바라보는 세상의 이야기" 
            desc2={<>개인회생이 고민 중이라면, <br />길잡이가 되어 드릴 이야기를 전합니다.</>} 
            readmorebtn="자세히 보기" color="black"
            />
          </div>
          <div className="post-section_right mo-only">
            {/* section 이미지 컨텐츠 :: MOBILE */}
            <div className="post-section_right_hero" data-aos="fade-up" data-aos-delay="300">
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
                    <p className="date">{KvData.result.firstLayout.date}</p>
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
          <div className="readmorebtn mo-only" data-aos="fade-in" data-aos-offset="10" data-aos-duration="300">
            <ReadMoreButton text="자세히 보기" direction="right"/>
          </div>     
        </div>
        <div className="post-section_right pc-tablet-only" >
          {/* section 이미지 컨텐츠 :: PC */}
          <div className="post-section_right_hero" data-aos="fade-up" data-aos-delay="200">
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
                <p className="text01">리본회생이 바라보는 세상의 이야기</p>
                <p className="month text02">
                  {KvData.result.firstLayout.dateEng}
                </p>
                <p className="text03">Monthly Stories</p>
                <div className="text04">
                  <p>{KvData.result.firstLayout.subText}</p>
                  <div className="line"></div>
                  <p className="date">{KvData.result.firstLayout.date}</p>
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
      <div className="post-section_bg" data-aos="fade-in" >
        <Image 
          // src={KvData.result.firstLayout.outterImageUrl} 
          src={bgImg} 
          alt="리본회생이 바라보는 세상의 이야기" 
          width={1920}
          height={1080}
          className="post-section_bg-image pc-tablet-only"
        />
        <Image 
          // src={KvData.result.firstLayout.outterImageUrlMo} 
          src={bgImgMo} 
          alt="리본회생이 바라보는 세상의 이야기" 
          width={1920}
          height={1080}
          className="post-section_bg-image mo-only"
        />        
      </div>
    </section>
  );
}