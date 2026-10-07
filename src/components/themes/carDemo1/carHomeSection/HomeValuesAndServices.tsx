import { Commitments, Services } from "@/components/pages/about/CommitmentsAndServices";
import { Container } from "reactstrap";

export default function HomeValuesAndServices() {
  return (
    <section className="exelero-about-section exelero-home-values" aria-label="Why choose Exelero Yachting">
      <Container>
        <Commitments />
        <Services headingId="home-services-title" />
      </Container>
    </section>
  );
}
