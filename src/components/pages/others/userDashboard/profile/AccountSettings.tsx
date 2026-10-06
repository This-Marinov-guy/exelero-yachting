"use client";
import { useUnsavedChanges } from "../useUnsavedChanges";

import UserProfile from "../userSidebar/UserProfile";
import CommonInput from "@/components/commonComponents/CommonInput";
import { getSupabaseBrowserClient, isLocalSupabase } from "@/lib/supabaseClient";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import AccountSkeleton from "../AccountSkeleton";

type PasskeyFactor = {
  id: string;
  friendly_name?: string;
  created_at?: string;
  last_used_at?: string;
  updated_at?: string;
};

const AccountSettings = () => {
  const supabase = getSupabaseBrowserClient();
  const localAuth = isLocalSupabase();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passkeys, setPasskeys] = useState<PasskeyFactor[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<"email" | "password" | "passkey" | null>(null);

  useUnsavedChanges(newEmail !== currentEmail || !!newPassword || !!confirmPassword || pendingAction !== null);

  const accountRedirectUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}/account` : "/account";

  const loadAccountSettings = async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) { setLoadFailed(true); throw userError; }

      const email = userData.user?.email ?? "";
      setCurrentEmail(email);
      setNewEmail(email);

      if (!localAuth) {
        const { data: passkeyData, error: passkeyError } = await supabase.auth.passkey.list();
        if (passkeyError) throw passkeyError;
        setPasskeys(passkeyData ?? []);
      }
    } catch (err: any) {
      toast.error(err?.message || "Unable to load account settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccountSettings();
  }, []);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = newEmail.trim();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (email === currentEmail) {
      toast.error("Enter a different email address.");
      return;
    }

    setPendingAction("email");
    try {
      const { data, error } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: accountRedirectUrl() }
      );
      if (error) throw error;

      if (data.user?.email) {
        setCurrentEmail(data.user.email);
        setNewEmail(data.user.email);
      }

      toast.success("Email update started. Check your inbox to confirm the change.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to update email.");
    } finally {
      setPendingAction(null);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setPendingAction("password");
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to update password.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleAddPasskey = async () => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error("This browser does not support passkeys.");
      return;
    }

    setPendingAction("passkey");
    try {
      const { data, error } = await supabase.auth.registerPasskey();
      if (error) throw error;
      if (!data?.id) throw new Error("Unable to create a passkey.");

      await supabase.auth.passkey.update({
        passkeyId: data.id,
        friendlyName: "Excelero",
      });

      const { data: passkeyData, error: passkeyError } = await supabase.auth.passkey.list();
      if (passkeyError) {
        await loadAccountSettings();
      } else {
        setPasskeys(passkeyData ?? []);
      }

      toast.success("Passkey added.");
    } catch (err: any) {
      toast.error(err?.message || "Unable to add passkey.");
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) return <AccountSkeleton kind="settings" />;

  if (loadFailed) return <div className="admin-empty"><h1 className="dashboard-title">Account settings</h1><p>Your settings are unavailable.</p><button type="button" className="btn-border" onClick={() => void loadAccountSettings()}>Try again</button></div>;
  return (
    <div className="account-settings-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title mb-0">Account settings</h1>
      </div>

      <div className="admin-profile"><h2>Profile</h2><UserProfile /></div>
      <details className="admin-form-section" open><summary>Email address</summary><Card className="dealer-form-card mb-4">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2">
            <Mail className="iconsax" style={{ width: "18px", height: "18px" }} />
            Email
          </CardTitle>
          <form noValidate onSubmit={handleEmailUpdate} className="dealer-form">
            <div className="mb-3">
              <CommonInput
                inputType="email"
                label="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={pendingAction === "email"}
              />
            </div>
            <Button type="submit" className="btn-solid" disabled={pendingAction !== null}>
              {pendingAction === "email" ? "Updating email..." : "Update email"}
            </Button>
          </form>
        </CardBody>
      </Card></details>

      <details className="admin-form-section"><summary>Password</summary><Card className="dealer-form-card mb-4">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2">
            <ShieldCheck className="iconsax" style={{ width: "18px", height: "18px" }} />
            Password
          </CardTitle>
          <form noValidate onSubmit={handlePasswordUpdate} className="dealer-form">
            <div className="mb-3">
              <CommonInput
                inputType="password"
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={pendingAction === "password"}
              />
            </div>
            <div className="mb-3">
              <CommonInput
                inputType="password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={pendingAction === "password"}
              />
            </div>
            <Button type="submit" className="btn-solid" disabled={pendingAction !== null}>
              {pendingAction === "password" ? "Updating password..." : "Update password"}
            </Button>
          </form>
        </CardBody>
      </Card></details>

      {!localAuth && <details className="admin-form-section"><summary>Passkeys</summary><Card className="dealer-form-card">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2 mb-3">
            <KeyRound className="iconsax" style={{ width: "18px", height: "18px" }} />
            Passkeys
          </CardTitle>
          <Button type="button" className="btn-solid mb-3" onClick={handleAddPasskey} disabled={pendingAction !== null}>
            {pendingAction === "passkey" ? "Adding passkey..." : "Add passkey"}
          </Button>
          {passkeys.length > 0 && (
            <div>
              {passkeys.map((passkey) => (
                <div key={passkey.id} className="d-flex justify-content-between align-items-center border rounded-2 p-3 mb-2">
                  <span>{passkey.friendly_name || "Passkey"}</span>
                  <small className="text-muted">Saved</small>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card></details>}
    </div>
  );
};

export default AccountSettings;
