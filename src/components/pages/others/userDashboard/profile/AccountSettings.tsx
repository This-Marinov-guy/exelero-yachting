"use client";

import CommonInput from "@/components/commonComponents/CommonInput";
import { saveStoredPasskey } from "@/lib/passkeyStorage";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle } from "reactstrap";

type PasskeyFactor = {
  id: string;
  friendly_name?: string;
  created_at?: string;
  updated_at?: string;
};

const AccountSettings = () => {
  const supabase = getSupabaseBrowserClient();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passkeyName, setPasskeyName] = useState("");
  const [passkeys, setPasskeys] = useState<PasskeyFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<"email" | "password" | "passkey" | null>(null);

  const accountRedirectUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}/account` : "/account";

  const loadAccountSettings = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const email = userData.user?.email ?? "";
      setCurrentEmail(email);
      setNewEmail(email);

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      setPasskeys(factorsData?.webauthn ?? []);
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

  const handleAddPasskey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      toast.error("This browser does not support passkeys.");
      return;
    }

    const friendlyName = passkeyName.trim() || `${currentEmail || "Excelero"} passkey`;
    const rpId = window.location.hostname;
    const rpOrigins = [window.location.origin];

    setPendingAction("passkey");
    let enrolledFactorId: string | null = null;

    try {
      const { data: factor, error: enrollError } = await supabase.auth.mfa.webauthn.enroll({
        friendlyName,
      });
      if (enrollError) throw enrollError;
      if (!factor?.id) throw new Error("Unable to create a passkey factor.");

      enrolledFactorId = factor.id;

      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.webauthn.challenge({
          factorId: factor.id,
          friendlyName: factor.friendly_name,
          webauthn: { rpId, rpOrigins },
        });
      if (challengeError) throw challengeError;
      if (!challenge) throw new Error("Unable to create a passkey challenge.");

      const { error: verifyError } = await supabase.auth.mfa.webauthn.verify({
        factorId: factor.id,
        challengeId: challenge.challengeId,
        webauthn: {
          type: challenge.webauthn.type,
          rpId,
          rpOrigins,
          credential_response: challenge.webauthn.credential_response,
        },
      });
      if (verifyError) throw verifyError;

      if (currentEmail) {
        saveStoredPasskey(currentEmail, {
          factorId: factor.id,
          friendlyName,
        });
      }

      setPasskeyName("");
      await loadAccountSettings();
      toast.success("Passkey added.");
    } catch (err: any) {
      if (enrolledFactorId) {
        await supabase.auth.mfa.unenroll({ factorId: enrolledFactorId });
      }
      toast.error(err?.message || "Unable to add passkey.");
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) {
    return <div className="dealer-info-loading">Loading account settings...</div>;
  }

  return (
    <div className="account-settings-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="dashboard-title mb-0">Account Settings</h4>
      </div>

      <Card className="dealer-form-card mb-4">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2">
            <Mail className="iconsax" style={{ width: "18px", height: "18px" }} />
            Email
          </CardTitle>
          <form onSubmit={handleEmailUpdate} className="dealer-form">
            <div className="mb-3">
              <CommonInput
                inputType="email"
                placeholder="Email"
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
      </Card>

      <Card className="dealer-form-card mb-4">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2">
            <ShieldCheck className="iconsax" style={{ width: "18px", height: "18px" }} />
            Password
          </CardTitle>
          <form onSubmit={handlePasswordUpdate} className="dealer-form">
            <div className="mb-3">
              <CommonInput
                inputType="password"
                placeholder="New password"
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
                placeholder="Repeat new password"
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
      </Card>

      <Card className="dealer-form-card">
        <CardBody>
          <CardTitle tag="h5" className="d-flex align-items-center gap-2">
            <KeyRound className="iconsax" style={{ width: "18px", height: "18px" }} />
            Passkeys
          </CardTitle>
          {passkeys.length > 0 && (
            <div className="mb-3">
              {passkeys.map((passkey) => (
                <div key={passkey.id} className="d-flex justify-content-between align-items-center border rounded-2 p-3 mb-2">
                  <span>{passkey.friendly_name || "Passkey"}</span>
                  <small className="text-muted">Saved</small>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleAddPasskey} className="dealer-form">
            <div className="mb-3">
              <CommonInput
                inputType="text"
                placeholder="Passkey name"
                value={passkeyName}
                onChange={(e) => setPasskeyName(e.target.value)}
                autoComplete="off"
                disabled={pendingAction === "passkey"}
              />
            </div>
            <Button type="submit" className="btn-solid" disabled={pendingAction !== null}>
              {pendingAction === "passkey" ? "Adding passkey..." : "Add passkey"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AccountSettings;
