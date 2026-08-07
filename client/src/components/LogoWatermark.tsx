interface LogoWatermarkProps {
  className?: string;
  opacity?: number;
}

export const LogoWatermark = ({
  className = "",
  opacity = 0.05,
}: LogoWatermarkProps) => {
  return (
    <img
      src="/assets/images/logo/logolap-transparent.png"
      alt=""
      aria-hidden="true"
      style={{ opacity }}
      className={`absolute pointer-events-none select-none ${className}`}
    />
  );
};
