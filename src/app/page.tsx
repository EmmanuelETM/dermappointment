"use client";

import { logout } from "@/actions/auth/logout";

export default function Page() {
  return (
    <div>
      whats good duds
      <br />
      <button
        onClick={async () => {
          await logout();
        }}
      >
        Log out
      </button>
    </div>
  );
}
