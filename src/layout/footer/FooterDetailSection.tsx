import { FooterSectionProps } from "@/types/Layout";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const FooterDetailSection: React.FC<FooterSectionProps> = ({ data, footerDemo }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (title: string) => setOpenSections((prevState) => ({ ...prevState, [title]: !prevState[title] }));

  return (
    <Fragment>
      {data.map((item, index) => {
        const ColClassName = item.contactList ? "col-lg-3 col-sm-5" : footerDemo ? "col-md-3 col-sm-6" : "col-md-2 col-sm-3";
        const isOpen = openSections[item.title];
        const linksId = `footer-links-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <div key={index} className={`${ColClassName} ${isOpen ? "open-footer-content" : ""}`}>
            <div>
              <div className="footer-title">
                <h4>
                  <span className="footer-title__heading">{item.title}</span>
                  <button type="button" className="footer-title__button" onClick={() => toggleSection(item.title)} aria-expanded={Boolean(isOpen)} aria-controls={linksId}>
                    {item.title}
                    <span className="footer-title__toggle" aria-hidden>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                </h4>
              </div>
              <ul id={linksId} className={`footer-link ${item.contactList ? "footer-contact" : ""}`}>
                {item.links.map((link, idx) => (
                  <li key={idx}>
                    {item.contactList ? (
                      <Fragment>
                        {typeof link.icon === "string" ? (
                          <i className={link.icon} />
                        ) : (
                          link.icon
                        )}
                        <span>{link.title}</span>
                      </Fragment>
                    ) : link.download ? (
                      <a className="footer-download-link" href={link.url} download={link.download}>
                        {link.title}
                      </a>
                    ) : (
                      <Link href={link.url ? link.url : ""}>{link.title}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default FooterDetailSection;
