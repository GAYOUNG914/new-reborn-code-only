"use client";

// import { useEffect } from "react";
// import Lenis from "lenis";
import "../styles/YourStoryContainer.scss";
import SectionKv from "./SectionKv";
import SectionBehindU from "./SectionBehindU";
import SectionUterview from "./SectionUterview";
import SectionCta from "./SectionCta";
import Banner from "./Banner";
import SectionReterview from "./SectionReterview";
import SectionToTop from "./SectionToTop";

const bannerImages = [
  {
    pc: "/workout-v2/images/contents/bg_ys_bn-1.png",
    mo: "/workout-v2/images/contents/bg_ys_bn-1_m.png"
  },
  {
    pc: "/workout-v2/images/contents/bg_ys_bn-2.png",
    mo: "/workout-v2/images/contents/bg_ys_bn-2_m.png"
  }
];

export default function YourStoryContainer() {

  return (
    <div className="your-stories">
      <SectionKv />
      <SectionUterview />
      {/* <SectionCta /> */}
      <SectionBehindU />
      {/* <SectionCta /> */}
      <div className="banner-first">
        <Banner pc={bannerImages[0].pc} mo={bannerImages[0].mo} />
      </div>
      <SectionReterview />
      {/* <SectionToTop /> */}
      <Banner pc={bannerImages[1].pc} mo={bannerImages[1].mo} />
    </div>
  );
}