import { ImagePath } from "@/constants";
import { OrderTabData, TableHead } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";
import { FC } from "react";
import { Table } from "reactstrap";

const TableOrder: FC<{ type: string }> = ({ type }) => {
  const FinalTableData = OrderTabData.find((data) => data.id === type)?.items || [];
  return (
    <div>
      <div className='table-responsive'>
        <Table>
          <thead className='table-header'>
            <tr>
              {TableHead.map((item, i) => {
                return <th key={i}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {FinalTableData.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className='item-flex'>
                    <RatioImage src={`${ImagePath}/${data.image}`} alt='img' className='img-fluid' />
                    <div className='item-details'>
                      <h6>{data.title}</h6>
                      <span>#EFGH-4156</span>
                    </div>
                  </div>
                </td>
                <td>{data.modal}</td>
                <td>{data.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TableOrder;
