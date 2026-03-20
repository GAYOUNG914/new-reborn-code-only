"use client";

import { useRouter } from "next/navigation";
import "../styles/OurStoryContainer.scss";
import SectionKv from "@/app/our-stories/components/SectionKv";
import SectionUSketch from "./SectionUSketch";
import SectionMore from "./SectionMore";
import SectionVlog from "./SectionVlog";
import SectionToTop from "@/components/new-reborn/SectionToTop";
import { USketchResponseData } from "@/data/our-stories/USketch";
import { VlogWorkData } from "@/data/our-stories/VlogWork";
import { VlogCultureData } from "@/data/our-stories/VlogCulture";
import { getVideoId } from "@/utils/getVideoId";

export default function OurStoryContainer() {

  const router = useRouter();

  // 모든 비디오 데이터를 하나의 배열로 합치기
  const allVideos = [
    ...USketchResponseData.map(item => item.result.contents[0]),
    ...VlogWorkData.map(item => item.result.contents[0]),
    ...VlogCultureData.map(item => item.result.contents[0])
  ];

  // 숏츠 비디오 페이지 열기 (인덱스 기반)
  const handlePlayVideo = (videoUrl: string) => {
    const videoIndex = allVideos.findIndex(video => getVideoId(video.videoUrl) === getVideoId(videoUrl));
    router.push(`/our-stories/${videoIndex}`);
    // window.location.href = `/our-stories/${videoIndex}`;
  };

  return (
    <div className="our-stories">
      <SectionKv />
      <SectionUSketch setActiveVideoUrl={handlePlayVideo} />
      <SectionMore />
      <SectionVlog setActiveVideoUrl={handlePlayVideo} />
      <SectionToTop desc="우리의 이야기를 처음부터<br/>읽어보세요." color="border-b" />
      <div className="vlog-bg"></div>
    </div>
  );
}
