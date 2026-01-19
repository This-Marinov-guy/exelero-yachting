import SearchTabList from "@/components/themes/common/SearchTabList";

const PropertyFilter = () => {
  return (
    <div className='property-home-tab'>
      <SearchTabList tabs endPoint={2} showTab={[1, 2, 10, 11]} button />
    </div>
  );
};

export default PropertyFilter;
