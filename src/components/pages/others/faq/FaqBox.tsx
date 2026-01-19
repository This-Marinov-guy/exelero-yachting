import { FAQAccordionData } from "@/data/pages/Others";
import { PropsType } from "@/types/HomeDemo";
import { FC, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
 
const FaqBox: FC<PropsType> = ({ type }) => {
  const [open, setOpen] = useState<string>("1");
  const toggle = (id: string) => setOpen((prevOpen) => (prevOpen === id ? "" : id));
  const filteredData = FAQAccordionData.find((data) => data.type === type)?.data || [];

  return (
    <div className="faq-box">
      <Accordion open={open} toggle={toggle}>
        {filteredData.map((item) => (
          <AccordionItem key={item.id}>
            <AccordionHeader targetId={item.id.toString()}>{item.question}</AccordionHeader>
            <AccordionBody accordionId={item.id.toString()}>
              <p>{item.answer}</p>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqBox;
