import { Commitments, Services } from "@/components/pages/about/CommitmentsAndServices";
import { Container } from "reactstrap";
import { getServerPublicLocale } from "@/lib/serverPublicLocale";
import { publicText } from "@/lib/publicText";

export default async function HomeValuesAndServices() {
  const locale = await getServerPublicLocale();
  return (
    <section className="exelero-about-section exelero-home-values" aria-label={publicText(locale, "Why choose Exelero Yachting")}>
      <Container>
        <Commitments />
        <Services headingId="home-services-title" />
      </Container>
    </section>
  );
}
