"use client";

import { useState } from "react";
import type { CharterInfoTab } from "@/lib/servicePageContent";

const CharterInfoTabs = ({ tabs }: { tabs: CharterInfoTab[] }) => {
  const [activeId, setActiveId] = useState(tabs[0].id);

  return (
    <div className="charter-info-tabs">
      <div className="charter-info-tabs__nav" role="group" aria-label="Charter information">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`charter-info-tabs__nav-item ${activeId === tab.id ? "charter-info-tabs__nav-item--active" : ""}`}
            aria-pressed={activeId === tab.id}
            aria-controls={`charter-info-${tab.id}`}
            onClick={() => setActiveId(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} id={`charter-info-${tab.id}`} className="charter-info-tabs__content" hidden={activeId !== tab.id}>
          <h2 className="charter-info-tabs__heading">{tab.label}</h2>
          {tab.paragraphs.map((paragraph, index) => <p key={index} className="charter-info-tabs__text">{paragraph}</p>)}
          {tab.items.length > 0 && <ul className="charter-info-tabs__list">{tab.items.map((item, index) => <li key={index}><strong>{item.label}:</strong> {item.text}</li>)}</ul>}
        </div>
      ))}
    </div>
  );
};

export default CharterInfoTabs;
