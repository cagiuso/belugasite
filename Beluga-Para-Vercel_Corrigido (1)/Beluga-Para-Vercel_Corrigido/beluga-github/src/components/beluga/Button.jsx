import { cloneElement } from "react";

export function Button({
  asChild,
  children,
  className = "",
  variant = "default",
  size,
  ...props
}) {
  const classes = `button button-${variant} ${size === "icon" ? "button-icon" : ""} ${className}`;
  return asChild ? (
    cloneElement(children, {
      ...props,
      className: `${classes} ${children.props.className || ""}`,
    })
  ) : (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
