import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_COUNT_OPTIONS = [
  1, 2, 3, 4, 5, 10, 20, 30, 60, 100, 200, 250, 300, 500,
];

function QuantityCounter({
  value = 1,
  onChange,
  disabled = false,
  min = 1,
  size = "md",
}) {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync with prop when external value changes
  if (value !== prevValue) {
    setPrevValue(value);
    setCurrentVal(value);
  }

  // Calculate coordinates to position the floating dropdown outside of any card/table
  const updateCoords = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 240;
    const dropdownHeight = 220;

    // Center under the trigger button
    let left = rect.left + rect.width / 2 - dropdownWidth / 2;
    if (left < 12) left = 12;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = window.innerWidth - dropdownWidth - 12;
    }

    // Check if dropdown fits below; if not, open upwards
    const spaceBelow = window.innerHeight - rect.bottom;
    let top = rect.bottom + 6;
    if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
      top = rect.top - dropdownHeight - 6;
    }

    setCoords({ top, left });
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on outside click, window resize, or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updateCoords();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Stepping through 1 < 2 < 3 < 4 < 5 < 10 < 20 < 30 < 60 < 100 < 200 < 250 < 300 < 500
  const handleStep = (direction) => {
    const num = parseInt(currentVal, 10) || min;

    let nextNum;
    if (direction === "up") {
      const nextOption = DEFAULT_COUNT_OPTIONS.find((v) => v > num);
      nextNum = nextOption !== undefined ? nextOption : num + 50;
    } else {
      const prevOptions = DEFAULT_COUNT_OPTIONS.filter((v) => v < num);
      if (prevOptions.length > 0) {
        nextNum = prevOptions[prevOptions.length - 1];
      } else {
        nextNum = min;
      }
    }

    setCurrentVal(nextNum);
    if (onChange) onChange(nextNum);
  };

  const handleSelectCount = (count) => {
    setCurrentVal(count);
    setIsOpen(false);
    if (onChange) onChange(count);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setCurrentVal(raw);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(currentVal, 10);
    const finalVal = !isNaN(parsed) && parsed >= min ? parsed : min;
    setCurrentVal(finalVal);
    if (onChange && finalVal !== value) {
      onChange(finalVal);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const isSmall = size === "sm";
  const btnDim = isSmall ? "30px" : "34px";
  const inputWidth = isSmall ? "46px" : "54px";

  const numVal = parseInt(currentVal, 10) || min;
  const isAtMin = numVal <= min;

  // Floating Dropdown element
  const dropdownElement = isOpen ? (
    <div
      ref={dropdownRef}
      className="shadow-lg rounded-3 p-3 bg-white"
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 10050,
        width: "240px",
        border: "1px solid var(--border-card)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="fw-bold text-muted text-uppercase"
          style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
        >
          Select Quantity
        </span>
        <span className="text-muted" style={{ fontSize: "0.72rem" }}>
          or type custom
        </span>
      </div>

      <div
        className="d-grid gap-1"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          maxHeight: "190px",
          overflowY: "auto",
        }}
      >
        {DEFAULT_COUNT_OPTIONS.map((num) => {
          const isSelected = numVal === num;
          return (
            <button
              key={num}
              type="button"
              className="btn btn-sm py-2 px-0 rounded-2 fw-bold text-center transition-all"
              style={{
                fontSize: "0.85rem",
                background: isSelected ? "var(--color-sage)" : "var(--bg-main)",
                color: isSelected ? "#ffffff" : "var(--text-main)",
                border: isSelected
                  ? "1px solid var(--color-sage)"
                  : "1px solid var(--border-card)",
                minHeight: "36px",
              }}
              onClick={() => handleSelectCount(num)}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div
      className="position-relative d-inline-flex align-items-center"
      ref={containerRef}
      style={{ userSelect: "none" }}
    >
      <div
        className="d-inline-flex align-items-center rounded-3 p-1"
        style={{
          background: "#ffffff",
          border: "1px solid var(--border-card)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* "-" Symbol Button on the Left */}
        <button
          type="button"
          className="btn btn-sm d-flex align-items-center justify-content-center p-0 rounded-2"
          style={{
            width: btnDim,
            height: btnDim,
            background: "var(--bg-main)",
            border: "1px solid var(--border-card)",
            color: "var(--text-main)",
            fontWeight: "bold",
            fontSize: isSmall ? "1rem" : "1.15rem",
            lineHeight: 1,
            cursor: disabled || isAtMin ? "not-allowed" : "pointer",
            opacity: disabled || isAtMin ? 0.45 : 1,
            transition: "all 0.15s ease",
          }}
          disabled={disabled || isAtMin}
          onClick={() => handleStep("down")}
          aria-label="Decrease quantity"
          title="Decrease count to previous preset"
        >
          <i className="bi bi-dash-lg"></i>
        </button>

        {/* Input & Down Arrowmark Dropdown in the Middle */}
        <div
          ref={buttonRef}
          className="d-flex align-items-center mx-1 px-1 rounded-2"
          style={{
            background: "var(--bg-main)",
            border: "1px solid var(--border-card)",
            height: btnDim,
          }}
        >
          <input
            type="number"
            min={min}
            className="form-control form-control-sm border-0 bg-transparent text-center fw-bold p-0"
            style={{
              width: inputWidth,
              boxShadow: "none",
              color: "var(--text-main)",
              fontSize: isSmall ? "0.88rem" : "0.95rem",
            }}
            value={currentVal}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label="Item count"
          />

          {/* Down Arrowmark Button */}
          <button
            type="button"
            className="btn btn-sm p-0 border-0 text-muted ms-1 d-flex align-items-center justify-content-center"
            style={{
              width: "20px",
              height: "20px",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            onClick={handleToggleDropdown}
            aria-label="Select default count"
            title="Choose from default numbers (1 to 500)"
            disabled={disabled}
          >
            <i
              className={`bi bi-chevron-${isOpen ? "up" : "down"}`}
              style={{ fontSize: "0.78rem" }}
            ></i>
          </button>
        </div>

        {/* "+" Symbol Button on the Right */}
        <button
          type="button"
          className="btn btn-sm d-flex align-items-center justify-content-center p-0 rounded-2"
          style={{
            width: btnDim,
            height: btnDim,
            background: "var(--color-sage-tint)",
            border: "1px solid var(--color-sage-border)",
            color: "var(--color-sage)",
            fontWeight: "bold",
            fontSize: isSmall ? "1rem" : "1.15rem",
            lineHeight: 1,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
          disabled={disabled}
          onClick={() => handleStep("up")}
          aria-label="Increase quantity"
          title="Increase count to next preset"
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      {/* Render Floating Dropdown via Portal into document.body so it is NEVER clipped by any card or table */}
      {typeof document !== "undefined" && dropdownElement
        ? createPortal(dropdownElement, document.body)
        : null}
    </div>
  );
}

export default QuantityCounter;
