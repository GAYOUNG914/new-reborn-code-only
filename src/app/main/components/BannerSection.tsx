import Image from "next/image";
import "../styles/BannerSection.scss";

const imagePaths = {
  titleImg: '/workout-v2/images/contents/banner_text-1.png',
  titleImgMo: '/workout-v2/images/contents/banner_text_mo.png',
  bannerImg01: '/workout-v2/images/contents/img_main_banner-01-1.png',
  bannerImg01Mo: '/workout-v2/images/contents/img_main_banner-01-1_mo.png',
};

const dummydata = [
  {
    id: 1,
    image: imagePaths.bannerImg01,
    imageMo: imagePaths.bannerImg01Mo,
  },
  // {
  //   id: 2,
  //   image: imagePaths.bannerImg01,
  //   imageMo: imagePaths.bannerImg01Mo,
  // },
  // {
  //   id: 3,
  //   image: imagePaths.bannerImg01,
  //   imageMo: imagePaths.bannerImg01Mo,
  // }
]

export default function BannerSection() {
  return (
    <section className="banner-section">
      <div className="banner-section-container">
        <div className="banner-section_title" data-aos="fade-up">
          <Image className="pc-tablet-only" src={imagePaths.titleImg} alt="banner" width={345} height={60} />
          <Image className="mo-only" src={imagePaths.titleImgMo} alt="banner" width={159} height={108} />
        </div>
        <div className="banner-section_contents" data-aos="fade-up">
          {dummydata.map((item) => (
            <button className="item" key={item.id} onClick={() => {
              console.log(item.id);
            }}>
              <Image className="pc-tablet-only" src={item.image} alt="banner" width={1262} height={527} />
              <Image className="mo-only" src={item.imageMo} alt="banner" width={1262} height={527} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}