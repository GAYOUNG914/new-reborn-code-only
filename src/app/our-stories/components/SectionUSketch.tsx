"use client";

import "../styles/SectionUSketch.scss";
import useIsMobile from "@/utils/useIsMobile";
import Title from "@/app/our-stories/components/Title";
import Image from "next/image";
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';
import PlayButton from "@/components/new-reborn/PlayButton";

import { USketchResponseData } from "@/data/our-stories/USketch";
import { OurStoriesResponse } from "@/types/OurStories";
import React from "react";


type SectionUSketchProps = {
  setActiveVideoUrl: (url: string) => void;
};


export default function SectionUSketch({ setActiveVideoUrl }: SectionUSketchProps) {

  const isMobile = useIsMobile();

  return (
      <section className="section-u-sketch">
        <Title
          title="U스케치"
          desc={<>리본회생의 사람들이 <br className="mo-only"/>고객을 위해 어떠한 고민을 하는지 그려냈습니다.</>}></Title>
        
          <div className="u-s_list">
            {USketchResponseData?.map((response: OurStoriesResponse, index: number) => {
              const item = response.result.contents[0];
              return (
                <div className="u-s_item" key={item.id} data-aos="fade-up">
                  <div className="u-s_item-thumnail" onClick={() => setActiveVideoUrl(item.videoUrl)}>
                    <PlayButton />
                    <Image src={item.imageUrl} alt='' width={350} height={524}></Image>
                  </div>

                  <div className="u-s_item-contents">
                    <span className="u-s_item-contents-title">{item.title}</span>
                    <p className="u-s_item-contents-desc">
                      {item.article.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>

                    <div className="u-s_item-contents-tag">
                      {item.tagIds.map((tag, tagIndex) => (
                        <span key={tagIndex}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="u-s_shape shape-1">
            <Image src={
              isMobile ?
              '/workout-v2/images/contents/img_our_shape_bg-1-mo.png' :
              '/workout-v2/images/contents/img_our_shape_bg-1-pc.png'
              }
              alt={'shape1'}
              width={isMobile ? 206 : 206} height={isMobile ? 206 : 206} />
          </div>

          <div className="u-s_shape shape-2">
            <Image src={
              isMobile ?
              '/workout-v2/images/contents/img_our_shape_bg-2-mo.png' :
              '/workout-v2/images/contents/img_our_shape_bg-2-pc.png'
              }
              alt={'shape2'}
              width={isMobile ? 900 : 900} height={isMobile ? 877 : 877} />
          </div>

          <div className="u-s_shape shape-3">
            <Image src={
              isMobile ?
              '/workout-v2/images/contents/img_our_shape_bg-3-mo.png' :
              '/workout-v2/images/contents/img_our_shape_bg-3-pc.png'
              }
              alt={'shape3'}
              width={isMobile ? 354 : 354} height={isMobile ? 354 : 354} />
          </div>

        <ReadMoreButton color="border-b" />

      </section>
      
  );
}