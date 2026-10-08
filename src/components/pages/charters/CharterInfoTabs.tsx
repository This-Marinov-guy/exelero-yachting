"use client";

import { useState } from "react";

type InfoTab = {
  id: string;
  label: string;
  paragraphs?: string[];
  items?: { label: string; text: string }[];
};

const INFO_TABS: InfoTab[] = [
  {
    id: "why",
    label: "Why X-Yachts",
    paragraphs: [
      "Sailing is not just about moving from one port to another—it is about how the journey feels beneath your hands and under your feet. Founded in Denmark in 1979, X-Yachts has built a legacy of more than four decades defined by an unyielding commitment to supreme build quality, structural integrity, and uncompromising safety at sea. Crafted with extreme precision, every yacht reflects the craftsmanship of the Danish naval industry.",
      "Choosing X-Yachting means gaining access to an exclusive fleet, including flagship cruisers like the Xc 47 and race-proven champions like the XR 41, which continues to dominate prestigious podiums in world-class competitions across the Baltic, Mediterranean, and Aegean seas.",
      "Whether you are cutting through swell with effortless precision or relaxing in a meticulously engineered salon, every detail is designed to deliver an unmatched sailing experience. It is the ultimate opportunity to feel the responsiveness and safety of a world-class performance yacht in real Mediterranean conditions, whether for the vacation of a lifetime or the ultimate “try before you buy” journey.",
    ],
  },
  {
    id: "who",
    label: "Who is it for?",
    items: [
      { label: "For everyone", text: "Suitable for all levels, regardless of prior sailing experience." },
      { label: "Families & friends", text: "Ideal for relaxed vacations, island-hopping, and authentic sailing comfort." },
      { label: "Discerning & experienced sailors", text: "Perfect for those wanting to take full command of a luxury performance yacht." },
      { label: "Competitive racers", text: "Tailored packages for offshore regattas, racing charters, and performance sailing in Greece." },
      { label: "Day cruisers & speed enthusiasts", text: "Designed for guests seeking fast, comfortable motorboat day escapes or private transfers." },
    ],
  },
  {
    id: "when-where",
    label: "When & where?",
    paragraphs: [
      "The Mediterranean season comes alive from March through November, offering a breathtaking canvas of sun-drenched days, steady Meltemi winds, and calm, crystalline waters. Starting your journey at Olympic Marine in Lavrio, Greece—just a 35-minute drive from Athens International Airport—you are positioned perfectly at the gateway to the Aegean.",
      "Within just 16 nautical miles, the majestic Cyclades and Saronic Gulf open up before you: sail past the iconic ancient Temple of Poseidon perched high above Cape Sounion, explore the volcanic caldera and iconic cliffside villages of Santorini, anchor in the glamorous bays of Mykonos, discover the natural sea caves of Milos, drop anchor in secluded turquoise coves, and spend evenings in vibrant waterfront tavernas sampling local Greek culinary delicacies.",
    ],
    items: [
      { label: "Charter season", text: "March through November." },
      { label: "Base location", text: "Olympic Marine, Lavrio, Greece (35 minutes from Athens International Airport)." },
      { label: "Standard duration", text: "Saturday midday to Saturday morning (1, 2, 3, or more weeks). Flexible dates, short stays, and single-day escapes are also available." },
    ],
  },
  {
    id: "models",
    label: "Available models",
    items: [
      { label: "X-Yachts Xc 47", text: "The best cruiser X-Yachts has ever built, available for charter exclusively through X-Yachting worldwide." },
      { label: "X-Yachts X4⁶", text: "A versatile family performance cruiser balancing speed, supreme comfort, and effortless handling for all skill levels." },
      { label: "X-Yachts X4³ MkII", text: "Crafted with advanced technology for maximum structural strength, safety, and pure sailing pleasure." },
      { label: "X-Yachts X4⁰", text: "A compact luxury performance yacht blending premium quality and style for long-distance cruising." },
      { label: "X-Yachts XR 41", text: "The pinnacle of pure racing DNA—a race-ready champion designed for serious competitive charter racing, ORC regattas, and high-speed offshore passage-making without compromising performance." },
      { label: "X-Yachts Xp 44", text: "The ultimate performance sailing yacht, engineered for speed, power, and easy short-handed handling." },
      { label: "X-Power 33c", text: "A luxury powerboat (gentleman’s cruiser) built for high-speed day escapes, island-hopping, and sea transfers with unmatched quality." },
    ],
  },
];

const CharterInfoTabs = () => {
  const [activeId, setActiveId] = useState("why");

  return (
    <div className="charter-info-tabs">
      <div className="charter-info-tabs__nav" role="group" aria-label="Charter information">
        {INFO_TABS.map((tab) => (
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
      {INFO_TABS.map((tab) => (
        <div key={tab.id} id={`charter-info-${tab.id}`} className="charter-info-tabs__content" hidden={activeId !== tab.id}>
          <h2 className="charter-info-tabs__heading">{tab.label}</h2>
          {tab.paragraphs?.map((paragraph) => <p key={paragraph} className="charter-info-tabs__text">{paragraph}</p>)}
          {tab.items && <ul className="charter-info-tabs__list">{tab.items.map((item) => <li key={item.label}><strong>{item.label}:</strong> {item.text}</li>)}</ul>}
        </div>
      ))}
    </div>
  );
};

export default CharterInfoTabs;
