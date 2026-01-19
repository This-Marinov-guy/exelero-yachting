import { Form } from "reactstrap";
import AreaDetail from "./AreaDetail";
import CreatePropertyDetail from "./CreatePropertyDetail";
import Gallery from "./Gallery";
import PriceDetail from "./PriceDetail";
import PropertyAllDetails from "./PropertyAllDetails";
import PropertyCheckBox from "./PropertyCheckbox";

const CreateProperty = () => {
  return (
   <div className="common-card">
      <Form>
        <PropertyAllDetails />
        <PropertyCheckBox />
        <AreaDetail />
        <CreatePropertyDetail />
        <PriceDetail />  
        <Gallery/>          
      </Form>
   </div>
  );
};

export default CreateProperty;
