function QuantityBadge({
  quantity,
  variant = "sage",
  className = "",
  size = "md",
  showIfOne = false,
}) {
  if (quantity === undefined || quantity === null || quantity === "") return null;

  const count = parseInt(quantity, 10);
  if (isNaN(count) || count <= 0) return null;
  if (count === 1 && !showIfOne) return null;

  const isAmber = variant === "amber";
  const isSm = size === "sm";

  return (
    <span
      className={`badge rounded-pill ms-2 d-inline-flex align-items-center ${className}`}
      style={{
        background: isAmber ? "var(--color-amber-light)" : "var(--color-sage-tint)",
        color: isAmber ? "var(--color-amber)" : "var(--color-sage)",
        border: `1px solid ${isAmber ? "#fde68a" : "var(--color-sage-border)"}`,
        fontSize: isSm ? "0.72rem" : "0.78rem",
        fontWeight: "700",
        letterSpacing: "0.02em",
        padding: isSm ? "0.2em 0.55em" : "0.25em 0.65em",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      }}
      title={`Quantity Count: ${count}`}
    >
      <span style={{ opacity: 0.75, marginRight: "3px", fontSize: "0.7rem" }}>Qty:</span>
      {count}
    </span>
  );
}

export default QuantityBadge;
