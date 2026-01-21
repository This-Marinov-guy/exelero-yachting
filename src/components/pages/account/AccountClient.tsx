"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Container } from "reactstrap";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";

export default function AccountClient() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [status, setStatus] = useState<"loading" | "authed" | "redirecting">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const sessionEmail = data.session?.user?.email ?? null;
        if (!sessionEmail) {
          // Keep a loading screen visible while we redirect (prevents a flash of content).
          if (mounted) setStatus("redirecting");
          router.replace(RouteList.Auth.SignUp);
          return;
        }

        if (mounted) {
          setEmail(sessionEmail);
          setStatus("authed");
        }
      } catch (e: any) {
        // Fail closed
        if (mounted) setStatus("redirecting");
        router.replace(RouteList.Auth.SignUp);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out.");
      router.replace(RouteList.Auth.SignIn);
    } catch (e: any) {
      toast.error(e?.message ?? "Unable to sign out.");
    }
  };

  if (status !== "authed") {
    return (
      <ExceleroLoader/>
    );
  }

  return (
    <section className="section-b-space">
      <Container>
        <div className="py-5">
          <h1>Account</h1>
          <p className="mt-3 mb-4">
            Signed in as: <strong>{email}</strong>
          </p>
          <Button className="btn-solid" type="button" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </Container>
    </section>
  );
}

