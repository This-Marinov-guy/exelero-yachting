"use client";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const BoatsListing = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDealerInfo = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsLocked(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("broker_data")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      setIsLocked(!data || data.length === 0);
      setLoading(false);
    };

    checkDealerInfo();

    // Listen for dealer data changes
    const handleDealerDataChanged = () => {
      checkDealerInfo();
    };
    
    window.addEventListener("dealerDataChanged", handleDealerDataChanged);

    return () => {
      window.removeEventListener("dealerDataChanged", handleDealerDataChanged);
    };
  }, []);

  if (loading) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Boats Listing</h4>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Boats Listing</h4>
          <p className="text-muted">This section is locked. Please save your dealer information first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="boats-listing-section">
      <h4 className="dashboard-title">Boats Listing</h4>
      <p className="text-muted">Boats listing functionality will be available here.</p>
    </div>
  );
};

export default BoatsListing;
