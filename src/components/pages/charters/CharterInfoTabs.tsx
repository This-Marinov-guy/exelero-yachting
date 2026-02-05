"use client";

import { useEffect, useState } from "react";

const INFO_TABS = [
  {
    id: "who",
    label: "Who is it for?",
    body: [
      "For everyone regardless of sailing experience.",
      "Whether you are a pro sailor or a comfort‑oriented cruiser travelling with your family or friends, we match you with the right yacht, route, and level of support.",
      "From fully crewed charters to more hands‑on sailing adventures, we’ll help you get the most out of your time on the water.",
    ],
  },
  {
    id: "when-where",
    label: "When & where?",
    body: [
      'Sail when it suits you, where it inspires you most.',
      "We work around your calendar, planning departures and arrivals to fit your travel plans, events, or regattas.",
      "From local weekend escapes to longer coastal or island‑hopping itineraries, we help you choose the best season and destination for the experience you have in mind.",
    ],
  },
  {
    id: "boats",
    label: "Boats",
    body: [
      "Varies on your needs and preferences.",
      "Choose from agile performance cruisers, comfortable family yachts, racers or more luxurious options with extra amenities.",
      "Every boat is selected for seaworthiness and comfort, so you can focus on sailing and enjoying the journey rather than worrying about the details.",
    ],
  },
];

const CharterInfoTabs = () => {
  const [activeId, setActiveId] = useState<string>("who");
  const [userInteracted, setUserInteracted] = useState(false);
  const active = INFO_TABS.find((tab) => tab.id === activeId) ?? INFO_TABS[0];

  // Auto-rotate tabs until the user interacts
  useEffect(() => {
    if (userInteracted) return;

    const interval = setInterval(() => {
      setActiveId((prev) => {
        const currentIndex = INFO_TABS.findIndex((tab) => tab.id === prev);
        const nextIndex = (currentIndex + 1) % INFO_TABS.length;
        return INFO_TABS[nextIndex].id;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [userInteracted]);

  return (
    <div className="charter-info-tabs">
      <div className="charter-info-tabs__nav">
        {INFO_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`charter-info-tabs__nav-item ${activeId === tab.id ? "charter-info-tabs__nav-item--active" : ""}`}
            onClick={() => {
              setActiveId(tab.id);
              setUserInteracted(true);
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="charter-info-tabs__content">
        {/* <h3 className="charter-info-tabs__heading">{active.heading}</h3> */}
        {active.body.map((paragraph, idx) => (
          <p key={idx} className="charter-info-tabs__text">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CharterInfoTabs;

