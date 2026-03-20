import "./PlayButton.scss";

type PlayButtonProps = { onClick?: () => void };

export default function PlayButton({ onClick }: PlayButtonProps) {

  return (
    <button type="button" className="btn-play">
      <span className="blind">재생</span>
      <span className="icon"/>
    </button>
  );
}
