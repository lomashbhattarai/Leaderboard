import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getCommonStyles } from "../../themes/commonComponents";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className = "",
  position = "top",
}) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={styles.tooltip}
          className={`
            absolute z-50 px-3 py-2 text-sm
            rounded-md shadow-lg whitespace-nowrap
            ${positionClasses[position]}
            ${className}
          `}
        >
          {content}
          <div
            style={{ background: styles.tooltip.background }}
            className={`
              absolute w-2 h-2 transform rotate-45
              ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                  : ""
              }
              ${
                position === "bottom"
                  ? "top-[-4px] left-1/2 -translate-x-1/2"
                  : ""
              }
              ${
                position === "left"
                  ? "right-[-4px] top-1/2 -translate-y-1/2"
                  : ""
              }
              ${
                position === "right"
                  ? "left-[-4px] top-1/2 -translate-y-1/2"
                  : ""
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
