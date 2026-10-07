import { Handshake, Sailboat, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RouteList } from "@/utils/RouteList";

const commitments = [
  {
    icon: ShieldCheck,
    title: "Quality above quantity",
    description: "We do not make empty promises or hide behind terms and conditions. We guarantee our products and stand behind them.",
  },
  {
    icon: Handshake,
    title: "Trusted Partners",
    description: "The brands and specialists we work with are selected because they are proven world-class enterprises.",
  },
  {
    icon: Sailboat,
    title: "Full Support",
    description: "From inquiry to first voyage and service, we provide a complete 360° customer experience.",
  },
];

const services = [
  { title: "New Yachts Dealership", lines: ["New Yachts", "Dealership"], href: RouteList.Pages.NewYachts },
  { title: "Pre-owned Yachts", lines: ["Pre-owned", "Yachts"], href: RouteList.Pages.PreOwnedYachts },
  { title: "Yacht Transportation", lines: ["Yacht", "Transportation"], href: RouteList.Pages.Services.Transportation },
  { title: "Yacht Charters", lines: ["Yacht", "Charters"], href: RouteList.Pages.Charters },
];

export function Commitments() {
  return (
    <div className="about-commitments" aria-label="Our commitments">
      {commitments.map(({ icon: Icon, title, description }) => (
        <div className="about-commitment" key={title}>
          <Icon className="about-commitment__icon" size={28} strokeWidth={1.8} aria-hidden="true" />
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}

export function Services({ headingId = "about-services-title" }: { headingId?: string }) {
  return (
    <section className="about-services" aria-labelledby={headingId}>
      <h2 id={headingId}>Our Services</h2>
      <div className="about-services__grid">
        {services.map(({ title, lines, href }) => (
          <Link key={title} href={href} aria-label={title}>
            <span>{lines[0]}<br />{lines[1]}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
