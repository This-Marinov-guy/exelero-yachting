import { CarFaqs } from "@/data/car";
import React from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

const FAQ = () => {
  const [open, setOpen] = React.useState("faqOne");
  const toggle = (id: React.SetStateAction<string>) => {
    setOpen(open === id ? "" : id);
  };
  return (
    <div className='detail-box' id="faq">
      <h3 className='car-title'>Car FAQ</h3>
      <div className='faq-box'>
        <Accordion open={open} toggle={toggle}>
          {CarFaqs.map((faq) => (
            <AccordionItem key={faq.id}>
              <AccordionHeader targetId={faq.id}>{faq.question}</AccordionHeader>
              <AccordionBody accordionId={faq.id}>
                <p>{faq.answer}</p>
              </AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
