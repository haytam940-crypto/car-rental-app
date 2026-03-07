type Props = {
  name: string;
  size?: number;
  className?: string;
  fill?: boolean;
};

export default function MIcon({ name, size = 24, className = "", fill = false }: Props) {
  return (
    <span
      className={`material-symbols-rounded select-none leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
