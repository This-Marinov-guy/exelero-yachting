"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";

export default function AuthAccountIcon() {
  const supabase = getSupabaseBrowserClient();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthed(!!data.session);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthed(!!session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // Don't render anything until we know (prevents a flash)
  if (!isAuthed) return null;

  return (
    <div className="header-account-icon">
      <Link href={RouteList.Auth.Account} className="header-account-link" aria-label="Account">
        <UserCircle className="iconsax" style={{ width: '24px', height: '24px' }} />
      </Link>
    </div>
  );
}

