type ContainerProps = {
  children: React.ReactNode;
  size?: "default" | "medium" | "small";
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
};

export function Container({
  children,
  size = "default",
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  const sizeClass =
    size === "medium"
      ? "container container-medium"
      : size === "small"
        ? "container container-small"
        : "container";

  return <Tag className={`${sizeClass} ${className}`.trim()}>{children}</Tag>;
}
