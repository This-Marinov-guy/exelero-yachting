"use client";

import { useState } from "react";

const SKIPPER_TABS = [
  {
    id: "full-time",
    label: "Full Time Skipper",
    description:
      "On board throughout your trip, providing safe, discreet, and knowledgeable handling of the yacht. Offers local insight of destinations and worry-free time on board.",
  },
  {
    id: "day-one",
    label: "Day-One Skipper",
    description:
      "On board for the first day of your trip, familiarizing you with all the yacht systems and handling of the boat. Offers valuable information and planning for the rest of your trip.",
  },
  {
    id: "ghost",
    label: "Ghost Skipper",
    description:
      "On board throughout your trip, acting as a supportive voice in a very discreet manner whenever needed. Offers relaxed handling of the yacht and skill refinement when desired.",
  },
  {
    id: "bareboat",
    label: "Bareboat",
    description:
      "Ideal for experienced sailors. Chart your own boat for the occasion and sail at your own pace.",
  },
];

const CharterSkipperTabs = () => {
  const [activeSkipperTab, setActiveSkipperTab] = useState<string>("full-time");
  const active = SKIPPER_TABS.find((tab) => tab.id === activeSkipperTab) ?? SKIPPER_TABS[0];

  return (
    <div className="charter-skipper-tabs">
      <h3 className="charter-skipper-tabs__title">With or without a skipper?</h3>
      <div className="charter-skipper-tabs__nav">
        {SKIPPER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`charter-skipper-tabs__nav-item ${
              activeSkipperTab === tab.id ? "charter-skipper-tabs__nav-item--active" : ""
            }`}
            onClick={() => setActiveSkipperTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="charter-skipper-tabs__content">{active.description}</p>
    </div>
  );
};

export default CharterSkipperTabs;

