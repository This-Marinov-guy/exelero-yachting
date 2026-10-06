"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";

export default function AuthAccountIcon() {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? getSupabaseBrowserClient()
    : null;
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    let revision = 0;
    let validationTimer: ReturnType<typeof setTimeout> | undefined;

    const verifyUser = async () => {
      const currentRevision = ++revision;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (mounted && currentRevision === revision) setIsAuthed(!error && !!data.user);
      } catch {
        if (mounted && currentRevision === revision) setIsAuthed(false);
      }
    };

    void verifyUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      revision += 1;
      clearTimeout(validationTimer);
      if (!session?.user) {
        setIsAuthed(false);
        return;
      }
      // Auth callbacks run while the session lock is held. Verify outside it.
      validationTimer = setTimeout(() => void verifyUser(), 0);
    });

    return () => {
      mounted = false;
      clearTimeout(validationTimer);
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // Don't render anything until we know (prevents a flash)
  if (!isAuthed) return null;

  return (
    <div className="header-account-icon">
      <a href={RouteList.Auth.Account} className="header-account-link" aria-label="Admin account" title="Admin account" rel="nofollow">
        <UserCircle className="iconsax" style={{ width: '24px', height: '24px' }} />
      </a>
    </div>
  );
}
