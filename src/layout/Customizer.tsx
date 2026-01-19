import { useState } from "react";
import { Button } from "reactstrap";
import ConfigDB from "@/config/ThemeConfig";
import { PathTypes } from "@/types/Layout";
import { DarkModeHidden } from "@/data/pages/Others";

const Customizer: React.FC<PathTypes> = ({ part }) => {
  const [isLayoutMode, setLayoutMode] = useState(false);
  const [isLayoutType, setLayoutType] = useState(false);

  const toggleLayoutMode = () => {
    const mode = isLayoutMode ? "light" : "dark";
    document.body.classList.toggle("light", isLayoutMode);
    document.body.classList.toggle("dark", !isLayoutMode);
    ConfigDB.mix_background_layout = mode;
    setLayoutMode(!isLayoutMode);
  };

  const toggleLayoutType = () => {
    const layoutType = isLayoutType ? "ltr" : "rtl";
    document.documentElement.dir = layoutType;
    ConfigDB.layout_type = layoutType;
    setLayoutType(!isLayoutType);
  };

  const shouldRender = !DarkModeHidden.includes(part[2]) && !DarkModeHidden.includes(part[0]) && !DarkModeHidden.includes(part[1]) && !DarkModeHidden.includes(part[3]);
  return (
    <>
      {part[2] !== "portfolio-vertical-slider" && (
        <div className={`theme-btn-flex ${part[0] === "job" ? "job-color-change" : part[0] === "car-2" ? "car2-color-change" : ""}`}>
          {shouldRender && (
            <Button className="mode-button mode-change-button" onClick={toggleLayoutMode}>
              <i className={`ri-${isLayoutMode ? "sun" : "moon"}-line`} />
              <span>{isLayoutMode ? "Light" : "Dark"}</span>
            </Button>
          )}
          <Button className="mode-button rtlBtnEl" onClick={toggleLayoutType}>
            <i className="ri-repeat-line" />
            <span>{isLayoutType ? "LTR" : "RTL"}</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default Customizer;
