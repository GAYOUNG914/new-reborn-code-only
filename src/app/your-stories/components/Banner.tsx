import "../styles/Banner.scss";

interface BannerProps {
  pc: string;
  mo: string;
}

export default function Banner({ pc, mo }: BannerProps) {
  
  return (
    <>
      <section className="banner-wrap" >
        <button type="button" data-aos="fade-up">
          <div className="bg-img pc-tablet-only" style={{ background: `url(${pc}) no-repeat center / cover` }} ></div>
          <div className="bg-img mo-only" style={{ background: `url(${mo}) no-repeat center / cover` }} ></div>
        </button>
      </section>
    </>
  );
}