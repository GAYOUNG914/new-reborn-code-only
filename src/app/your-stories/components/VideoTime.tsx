type Props = {
  second: number; // 초 단위
};

export default function VideoTime({ second }: Props) {
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;

  const format = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="time-length">
      <span>{format(minutes)}</span>:<span>{format(seconds)}</span>
    </div>
  );
};
