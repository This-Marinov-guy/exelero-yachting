import Image from "next/image";
import { SocialLinks } from "@/data/layout/Header";
import { PathTypes } from "@/types/Layout";
import Link from "next/link";
import { SVGPath } from "@/constants";
import { Container } from "reactstrap";

const TopBar: React.FC<PathTypes> = ({ part }) => {
  return (
    <div className={`first-topbar${part === "property-2" ? " bg-topbar" : ""}`}>
      <Container>
        <div className="topbar-flex">
          <ul className="topbar-left">
            <li>
              <Image src={`${SVGPath}/car2/call.svg`} height={50} width={50} alt="call" className="img-fluid" />
              <span>(702) 555-0122</span>
            </li>
            <li>
              <Image src={`${SVGPath}/car2/mail.svg`} height={50} width={50} alt="mail" className="img-fluid" />
              <span>general.info@gmail.com</span>
            </li>
          </ul>
          <ul className="topbar-right">
            {SocialLinks.map(({ href, icon }) => (
              <li key={href}>
                <Link scroll={false} href={href} target="_blank" rel="noopener noreferrer">
                  <i className={icon} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
