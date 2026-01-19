import { ImagePath, MyPropertyTitle } from "@/constants";
import { MyProperties, MyPropertiesHead } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";
import { Edit2, Trash } from "iconsax-react";
import { Button, Table } from "reactstrap";

const MyProperty = () => {
  return (
    <div className='common-card'>
      <div className='table-responsive property-table'>
      <h4 className='dashboard-title'>{MyPropertyTitle}</h4>
        <Table>
          <thead className='table-white'>
            <tr>
              {MyPropertiesHead.map((item, i) => {
                return <th key={i}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {MyProperties.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>
                    <div className='table-box'>
                      <RatioImage src={`${ImagePath}/${item.image}`} alt='p-1' className='img-fluid' />
                      <h6>{item.title}</h6>
                    </div>
                  </td>
                  <td>
                    <span>{item.availableUnits}</span>
                  </td>
                  <td>
                    <h6>{item.soldUnits}</h6>
                  </td>
                  <td>
                    <div className='d-flex align-items-center gap-3 justify-content-center'>
                      <Button color='transparent' className='edit-btn'>
                        <Edit2 color='#188aec' size={20} />
                      </Button>
                      <Button color='transparent' className='delete-btn'>
                        <Trash color='#dc3545' size={20} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MyProperty;
