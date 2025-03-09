"use client";

import { useCurrentUser } from "@/hooks/user-current-user";
import { logout } from "@/actions/auth/logout";

const SettingsPage = () => {
  const user = useCurrentUser();
  console.log(user);

  return (
    <div>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default SettingsPage;
