import SearchTabList from "@/components/themes/common/SearchTabList";

const FilterSection = () => {
  return (
    <div className='home-form-box'>
      <SearchTabList button icon pills form showTab={[1, 10, 2, 6]} />
    </div>
  );
};

export default FilterSection;
