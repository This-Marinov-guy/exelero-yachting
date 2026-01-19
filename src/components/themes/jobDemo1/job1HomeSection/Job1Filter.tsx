import SearchTabList from "../../common/SearchTabList";

const Job1Filter = () => {
  return (
    <div className='property-home-tab car-home-tab job-home-tab'>
      <SearchTabList showTab={[1, 7, 8, 9]} showNav scrollDown />
    </div>
  );
};

export default Job1Filter;
