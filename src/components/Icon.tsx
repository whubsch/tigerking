import React from "react";

interface IconProps {
  /** The SVG source (imported SVG file) */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Size classes (e.g., "h-4 w-4", "h-6 w-6") */
  size?: string;
  /** Whether to invert the colors (useful for dark mode) */
  invert?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  alt,
  size = "h-6 w-6",
  invert = true,
  className = "",
}) => {
  const invertClasses = invert
    ? "brightness-0 dark:brightness-100 dark:invert"
    : "";
  const classes = `${invertClasses} ${size} ${className}`.trim();

  return <img src={src} alt={alt} className={classes} />;
};

export default Icon;
