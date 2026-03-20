import "./PlayBlurButton.scss";

type PlayBlurButtonProps = { onClick?: () => void };

export default function PlayBlurButton({ onClick }: PlayBlurButtonProps) {

  return (
    <button type="button" className="btn-blur-play">
      <span className="blind">재생</span>
      <span className="icon"/>
    </button>
  );
}
