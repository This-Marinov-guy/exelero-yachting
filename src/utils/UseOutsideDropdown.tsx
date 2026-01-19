import { useEffect, useRef, useState } from "react";

export default function UseOutsideDropdown(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(initialIsVisible);
  const ref = useRef<HTMLDivElement | null | any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
