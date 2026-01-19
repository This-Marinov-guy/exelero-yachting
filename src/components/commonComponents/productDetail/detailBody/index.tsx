import { Sections } from "@/data/property";
import { PropertyDetailType } from "@/types/Product";
import UseStickyBar from "@/utils/UseStickyBar";
import { FC, Fragment, useEffect, useState } from "react";
import { AccordionBody, AccordionHeader, AccordionItem, Container, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledAccordion } from "reactstrap";
import FAQ from "./detailBodyItem/FAQ";
import Features from "./detailBodyItem/Features";
import OverViewSection from "./detailBodyItem/Overview";
import PropertyDescription from "./detailBodyItem/PropertyDescription";
import ReviewProperty from "./detailBodyItem/Review";
import ScheduleTour from "./detailBodyItem/ScheduleTour";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setScrollActive } from "@/redux/reducers/LayoutSlice";
import { debounce } from "lodash";

const DetailBody: FC<PropertyDetailType> = ({ type }) => {
  const { scrollActive } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  const [openItems, setOpenItems] = useState<string[]>(["overview", "amenities"]);
  const fix = UseStickyBar(300);

  const toggleAccordion = (id: string) => setOpenItems((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));

  useEffect(() => {
    if (Sections?.[0]?.id) {
      dispatch(setScrollActive(Sections[0].id));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2; //It calculates the middle of the visible window
      Sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            dispatch(setScrollActive(id));
          }
        }
      });
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]); //if dispatch ever changes, the useEffect would re-run to set up the correct event listener.

  return (
    <Fragment>
      {type === "scrollspy" ? (
        <Fragment>
          <div className={`sticky-header ${fix ? "sticky" : ""}`}>
            <Container>
              <Nav tabs>
                {Sections.slice(0, 6).map(({ id, label }) => (
                  <NavItem key={id} onClick={() => dispatch(setScrollActive(id))}>
                    <NavLink className={`${scrollActive === id ? "active" : ""}`} href={`#${id}`}>
                      {label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Container>
          </div>
          {Sections.map(({ labelComponent }, i) => (
            <Fragment key={i}>{labelComponent}</Fragment>
          ))}
        </Fragment>
      ) : type === "tabs" ? (
        <Fragment>
          <Nav tabs>
            {Sections.slice(0, 6).map((tab) => (
              <NavItem key={tab.id} onClick={() => dispatch(setScrollActive(tab.id))}>
                <NavLink tag="button" className={tab.id === scrollActive ? "active" : ""} href={`#${tab.id}`}>
                  {tab.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={scrollActive}>
            {Sections.slice(0, 6).map(({ id, component }) => (
              <TabPane key={id} tabId={id} className={`${id === scrollActive ? "show" : ""}`}>
                {component}
              </TabPane>
            ))}
          </TabContent>
          <ReviewProperty label />
          <ScheduleTour label />
        </Fragment>
      ) : type === "accordion" ? (
        <Fragment>
          <UncontrolledAccordion defaultOpen={openItems} stayOpen toggle={toggleAccordion}>
            {Sections.map((item, i) => (
              <AccordionItem key={i}>
                <AccordionHeader targetId={item.id}>{item.label}</AccordionHeader>
                <AccordionBody accordionId={item.id}>{item.component}</AccordionBody>
              </AccordionItem>
            ))}
          </UncontrolledAccordion>
        </Fragment>
      ) : type === "car" ? (
        <Fragment>
          <OverViewSection type={type} />
          <PropertyDescription type={type} />
          <Features />
          <FAQ />
          <ReviewProperty type={type} />
        </Fragment>
      ) : (
        <>
          {Sections.map(({ labelComponent }, index) => (
            <Fragment key={index}>{labelComponent}</Fragment>
          ))}
        </>
      )}
    </Fragment>
  );
};

export default DetailBody;
