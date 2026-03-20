import "../styles/Title.scss";

export default function Title({ children, title, desc }: { children?: React.ReactNode, title: string, desc?: string | React.ReactNode }) {
  return (
    <div className="c-title">
      <div className="c-title_title">
        <span className="h4_n">{title}</span>
        {children && children}
      </div>

      {
        desc &&
        <p className="c-title_desc">
          <span className="s1_n">{desc}</span>
        </p>
      }

    </div>
  );
}