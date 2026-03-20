import "./SectionToTop.scss";
import ButtonMore from './ReadMoreButton';

type SectionToTopProps = {
  desc: string,
  color?: "black" | "gray" | "border-w" | "border-b";
};

export default function SectionToTop({
  desc,
  color = "black",
}: SectionToTopProps) {

  return (
    <section className="section-to-top">
      <div className="to-top-wrapper">
        <p data-aos="fade" dangerouslySetInnerHTML={{ __html: desc }} />
        <div data-aos="fade">
          <ButtonMore
            text="TOP"
            direction="top"
            color={color}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </section>
  );
}
