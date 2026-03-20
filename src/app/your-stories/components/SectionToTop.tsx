import "../styles/SectionToTop.scss";
import ButtonMore from '../../../components/new-reborn/ReadMoreButton';

export default function SectionToTop() {

  return (
    <section className="section-to-top">
      <div className="to-top-wrapper">
        <div data-aos="fade">
          <div className="sub">리본회생이 만든 변화의 이야기</div>
          <p className="main">지금 <strong>확인</strong>해 보세요</p>
        </div>
        <div data-aos="fade" data-aos-delay="400">
          <ButtonMore
            text="TOP"
            direction="top"
            color="black"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </section>
  );
}
