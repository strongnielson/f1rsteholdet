"use client";

import { type FormEvent, useState } from "react";
import { updateProfile } from "@/app/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type ProfileEditPanelProps = {
  profile: Pick<Profile, "full_name" | "address" | "phone">;
};

export function ProfileEditPanel({ profile }: ProfileEditPanelProps) {
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setPasswordError("Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Adgangskoderne er ikke ens.");
      return;
    }

    setIsChangingPassword(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsChangingPassword(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    event.currentTarget.reset();
    setPasswordMessage("Adgangskoden er opdateret.");
  }

  return (
    <details className="profile-edit">
      <summary>Rediger profil</summary>

      <form action={updateProfile} className="profile-edit-form">
        <input name="fullName" placeholder="Fulde navn" defaultValue={profile.full_name ?? ""} />
        <input name="address" placeholder="Adresse" defaultValue={profile.address ?? ""} />
        <input name="phone" placeholder="Telefon" defaultValue={profile.phone ?? ""} />
        <button className="button button-secondary" type="submit">
          Gem profil
        </button>
      </form>

      <form className="profile-edit-form profile-password-form" onSubmit={handlePasswordChange}>
        <strong>Skift password</strong>
        <input name="password" placeholder="Nyt password" type="password" autoComplete="new-password" />
        <input
          name="confirmPassword"
          placeholder="Gentag password"
          type="password"
          autoComplete="new-password"
        />
        {passwordError ? <p className="profile-form-message profile-form-error">{passwordError}</p> : null}
        {passwordMessage ? <p className="profile-form-message profile-form-success">{passwordMessage}</p> : null}
        <button className="button button-secondary" disabled={isChangingPassword} type="submit">
          {isChangingPassword ? "Gemmer..." : "Skift password"}
        </button>
      </form>
    </details>
  );
}
