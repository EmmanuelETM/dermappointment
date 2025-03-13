import { logout } from "@/actions/auth/logout";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";

export const LogoutItem = () => {
  return (
    <DropdownMenuItem
      className="rounded-sm py-1 hover:bg-accent"
      onClick={async () => await logout()}
    >
      <div className="flex cursor-pointer items-center gap-2 pl-2 text-sm">
        <LogOut size={16} />
        Log out
      </div>
    </DropdownMenuItem>
  );
};
