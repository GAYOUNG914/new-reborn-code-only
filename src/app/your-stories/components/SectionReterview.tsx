"use client";

import Image from "next/image";
import "../styles/SectionRetervies.scss";
import Title from './Title';
import Tooltip from './Tooltip';
import useIsMobile from "@/utils/useIsMobile";
import { useRef, useEffect } from 'react';

import AudioPlayer from './AudioPlayer';
import bg_gradient from "@/app/assets/images/contents/bg_rt_pc.png";
import bg_gradient_m from "@/app/assets/images/contents/bg_rt_m.png";
import bg_gradient02 from "@/app/assets/images/contents/bg_rt_pc.png";
import bg_gradient02_m from "@/app/assets/images/contents/bg_rt_m.png";
import ButtonMore from "@/components/new-reborn/ReadMoreButton";

import turntable from "@/app/assets/images/contents/bg_turntable_new.png";
import turntable_m from "@/app/assets/images/contents/bg_turntable_m_new.png";

const audioContent = {
  id: 1,
  title: "조금씩, 괜찮아지는 중입니다 도움받을 곳",
  voiceActor: "성우 기담",
  subtitle: "구현정 님의 이야기",
  tagIds: ["보이스피싱"],
  imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/af7bdebc-4eae-4b87-a2e5-6ade0ae55c00/public",
  // audioUrl: "https://s3.url",
  // audioUrl: "/workout-v2/audio/your-stories/reterview/trumpet.mp3",
  audioUrl: "/workout-v2/audio/your-stories/reterview/mock.mp3",
  timeLength: 133, // 실제 오디오 길이 (133.32초)
  hide: false
};

const audioContent2 = {
  id: 2,
  title: "도움받을 곳이 있다는 걸, 너무 늦게 알았어요",
  voiceActor: "성우 운운",
  subtitle: "김민수 님의 이야기",
  tagIds: ["생활고"],
  imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/af7bdebc-4eae-4b87-a2e5-6ade0ae55c00/public",
  // audioUrl: "https://s3.url",
  audioUrl: "/workout-v2/audio/your-stories/reterview/trumpet.mp3",
  timeLength: 3, // 실제 오디오 길이 (2.72초)
  hide: false
};

const audioContent3 = {
  id: 3,
  title: "두 아이를 위해 포기하지 않았어요",
  voiceActor: "성우 감성그래픽",
  subtitle: "진민지 님의 이야기",
  tagIds: ["양육비부담"],
  imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/af7bdebc-4eae-4b87-a2e5-6ade0ae55c00/public",
  // audioUrl: "https://s3.url",
  audioUrl: "/workout-v2/audio/your-stories/reterview/trumpet.mp3",
  timeLength: 3, // 실제 오디오 길이 (2.72초)
  hide: false
};


export default function SectionReterview() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    console.log("모달 열기");
  };

  return (
    <section className="section-reterview" ref={sectionRef}>
      <div className="reterview-bg-image mo-only" data-aos="fade-in" data-aos-duration="800" data-aos-delay="1000">
        <Image src={turntable_m} alt="turntable" width={534} height={934} />
      </div>
      <div className="contents-wrap">
        <div className="contents-inner">
          <Title
            title="RE:코드"
            desc={
              <>
                채무로 무너졌던 일상이 다시 시작되기까지, <br />
                고객이 직접 전하는 이야기를 들어 보세요.
              </>
            }
          >
            <div className="badge">
              <span>팟캐스트 </span>
              {<Tooltip info={<>리본회생 고객님의 이야기를 <br /> 재구성하여 성우가 녹음한 콘텐츠입니다.</>} />}
            </div>
          </Title>
          <div className="audio-player-wrapper" data-aos="fade-up">
            {
              [audioContent, audioContent2, audioContent3].map((content, index) => (
                <AudioPlayer key={index} content={content}/>
              ))
            }
          <ButtonMore text="더보기" color="border-w" direction="down"
            onClick={() => { console.log("더보기 버튼 클릭") }} />            
          </div>
        </div>

      </div>
      <div className="reterview-bg-image pc-tablet-only" data-aos="fade-in" data-aos-duration="800" data-aos-delay="400">
        <Image src={turntable} alt="turntable" width={400} height={400} />
      </div>
      <div className="reterview-bg-image02" ref={bgImageRef}></div>
    </section>
  );
}
