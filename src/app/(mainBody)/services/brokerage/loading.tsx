import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

export default function BrokerageLoading() {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite" aria-label="Loading yachts">
      <div className="text-center exelero-loader-wrapper">
        <ExceleroLoader />
        <span className="visually-hidden">Loading yachts…</span>
      </div>
    </div>
  );
}
