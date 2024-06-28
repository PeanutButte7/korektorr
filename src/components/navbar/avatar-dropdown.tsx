"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";
import { createBrowserClient } from "@/utils/supabase/browser";

interface AvatarDropdownProps {
  email: string | undefined;
}

const AvatarDropdown = ({ email }: AvatarDropdownProps) => {
  const supabase = createBrowserClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            <IconUserCircle strokeWidth={1.5} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 space-y-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
      >
        {email && (
          <DropdownMenuLabel className="px-2 py-1 text-sm font-medium text-gray-900">{email}</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center rounded-md px-2 py-1 text-sm font-medium transition-colors"
          onSelect={() => supabase.auth.signOut().then(() => window.location.reload())}
        >
          <IconLogout className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
