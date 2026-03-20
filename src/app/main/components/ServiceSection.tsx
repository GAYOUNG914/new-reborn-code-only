import Image from "next/image";
import Title from "./Title";
import ReadMoreButton from "@/components/new-reborn/ReadMoreButton";

import "../styles/ServiceSection.scss";

import imgIntroKvGreen from '../../assets/images/contents/img_service_kv_green_new.png';
import imgIntroKvBlue from '../../assets/images/contents/img_service_kv_blue_new.png';
import imgIntroKvPurple from '../../assets/images/contents/img_service_kv_purple_new.png';

export default function ServiceSection() {
  return (
    <div className="service-section">
      <div className="service-section-container">
        <div className="service-section_title">
          <Title
            title="서비스 소개"
            desc="나에게 딱-맞는 서비스를 골라보세요"
            desc2={<>리본회생은 나에게 필요한 <br className="mo-only"/>리본을 선택할 수 있어요.</>}
            readmorebtn="자세히 보기" color="border-w"
            />
        </div>
        <div className="service-section_boxes">
          <ul>
            <li >
              <Image src={imgIntroKvGreen} alt="" data-aos="fade-up"/>
            </li>
            <li>
              <Image src={imgIntroKvBlue} alt="" data-aos="fade-up" data-aos-delay="100"/>
            </li>
            <li>
              <Image src={imgIntroKvPurple} alt="" data-aos="fade-up" data-aos-delay="200"/>
            </li>
          </ul>
        </div>
        <div className="mo-only" data-aos="fade-in" data-aos-offset="10" data-aos-duration="300">
          <ReadMoreButton text="자세히 보기" direction="right" color="border-w" />
        </div>
      </div>
    </div>
  );
}