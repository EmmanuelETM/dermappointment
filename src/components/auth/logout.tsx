import { logout } from "@/actions/logout";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";

export const LogoutItem = () => {
  return (
    <DropdownMenuItem onClick={async () => await logout()}>
      <div className="flex">
        <LogOut /> Log out
      </div>
    </DropdownMenuItem>
  );
};
