"use client";
import CookieBanner from "@/components/commonComponents/CookieBanner";
import LoadingOverlay from "@/components/commonComponents/LoadingOverlay";
import { SearchModalData } from "@/data/layout/Header";
import Footer from "@/layout/footer";
import FooterDemo2 from "@/layout/footer/FooterDemo2";
import Header from "@/layout/header";
import TapTop from "@/layout/TapTop";
import { PathSettings } from "@/types/Layout";
import { setFavicon } from "@/utils/SetFavicon";
import { CustomToaster } from "@/utils/Toaster";
import { useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SearchModal = dynamic(() => import("@/components/commonComponents/modal/SearchModal"));

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname() || "";
  const { searchModal } = useAppSelector((state) => state.layout);
  const segments = pathname.split("/").slice(1);
  const symbolRegex = /[!@#\$%\^\*\(\)_\+\{\}\[\]:;"'<>,.?/\\|`~=]/g;
  const [firstPart] = segments.map((item) => item.replace(symbolRegex, " "));

  const pathSettings: Record<string, PathSettings> = {
    "car-2": { className: "car2-color", favicon: "favicon-4.png" },
    "job": { className: "job-color", favicon: "favicon-5.png" },
    "job-2": { className: "job2-color large-container", favicon: "favicon-6.png" },
    "job-3": { className: "job3-color large-container", favicon: "favicon-7.png" },
    "property": { className: "", favicon: "favicon-1.png" },
    "property-2": { className: "property2-color", favicon: "favicon-2.png" },
    default: { className: "car-color", favicon: "favicon-3.png" },
  };

  const { className } = pathSettings[firstPart] || pathSettings.default;

  useEffect(() => {
    document.body.className = className;
    document.body.classList.toggle("home-scrollbar-hidden", pathname === "/");
    setFavicon("/assets/images/favicons/favicon.ico");
    const browserWindow = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const initAos = () => {
      import("aos").then(({ default: Aos }) => Aos.init({ once: true }));
    };
    const idleId = browserWindow.requestIdleCallback
      ? browserWindow.requestIdleCallback(initAos)
      : browserWindow.setTimeout(initAos, 1);

    return () => {
      if (browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleId);
      } else {
        browserWindow.clearTimeout(idleId);
      }
      setFavicon("/assets/images/favicons/favicon.ico");
    };
  }, [className, pathname]);
  
  const isJobOrProperty = ["car-2", "job-3", "job-2", "property-2"].some((item) => firstPart.includes(item));
  const secondPart = segments[1] || ""; // Get the second segment
  const carSpaceClass = secondPart === "detail" ? "car-detail-space" : "";

  const isHomePage = pathname === "/" || !firstPart;

  return (
    <div>
      <LoadingOverlay />
      <Header part={firstPart} />
      {/* <MobileMenu  part={firstPart}/> */}
      {children}
      {segments[2] !== "portfolio-vertical-slider" && (isJobOrProperty ? <FooterDemo2 part={firstPart} /> : <Footer part={firstPart} />)}
      {!isHomePage && <TapTop part={firstPart} />}
      {/* <Customizer part={segments} />       */}
      {searchModal && <SearchModal type={SearchModalData[firstPart] || SearchModalData.car} carSpaceClass={carSpaceClass} />}
      <CookieBanner />
      <CustomToaster/>
    </div>
  );
}
