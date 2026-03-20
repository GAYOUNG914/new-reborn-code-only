import "../styles/Title.scss";

export default function Title({ children, title, desc }: { children?: React.ReactNode, title: string, desc?: string | React.ReactNode }) {
  return (
    <div className="c-title">
      <div className="c-title_title" data-aos="fade-up">
        <h3 className="h4_n">{title}</h3>
        {children && children}
      </div>

      {
        desc &&
        <p className="c-title_desc" data-aos="fade-up" data-aos-delay="200">
          <span className="s1_n">{desc}</span>
        </p>
      }

    </div>
  );
}