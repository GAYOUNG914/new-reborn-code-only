import "../styles/Title.scss";

export default function Title({ title, desc, isToon = false }: { title: string, desc?: string | React.ReactNode, isToon?: boolean }) {
  return (
    <div className="c-title">
      <div className="c-title_badge">
        <span className="">Reborn</span>
      </div>
      <div className="c-title_title">
        <h3>{title}</h3>
        {isToon && <span className="c-title_title_toon">리본회생 모음.zip</span>}
      </div>
      <p className="c-title_desc">
        <span className="s2_n">{desc}</span>
      </p>
    </div>
  );
}