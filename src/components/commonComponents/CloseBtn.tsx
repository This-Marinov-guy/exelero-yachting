import { X } from "lucide-react";
import { Button } from "reactstrap";
import { Close } from "../../constants";

const CloseBtn = ({ toggle }: { toggle: () => void }) => {
  return (
    <Button onClick={toggle} close>
      {Close} <X className="iconsax"/>
    </Button>
  );
};

export default CloseBtn;
