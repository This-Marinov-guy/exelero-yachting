import { useEffect, useState } from "react";

const UseStickyBar = (scroll: number): boolean => {
  const [fix, setFix] = useState(false);

  useEffect(() => {
    const handleScroll = () => setFix(window.scrollY > (scroll || 300));
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scroll, fix]);

  return fix;
};

export default UseStickyBar;
