"use client";

import { logout } from "@/actions/auth/logout";

const SettingsPage = () => {
  return (
    <div>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default SettingsPage;
