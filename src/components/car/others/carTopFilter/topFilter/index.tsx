import { FiltersData } from "@/data/car";

const CarTopFilter = () => {
  return (
    <div className='top-flex'>
      <h5>Filter:</h5>
      <ul className='top-filter'>
        {FiltersData?.map((filter, i) => (
          <li key={filter.id} className={`${i + 1 === 1 ? "simple-select" : ""}`}>
            <select id={filter.id}>
              <option value=''>{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarTopFilter;
