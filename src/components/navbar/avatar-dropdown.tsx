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
        <Avatar className="border-2 text-slate-500 dark:text-slate-400 cursor-pointer">
          <AvatarFallback>
            <IconUserCircle />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 space-y-1 rounded-md border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950">
        {email && (
          <DropdownMenuLabel className="px-2 py-1 text-sm font-medium text-slate-900 dark:text-slate-50">
            {email}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center rounded-md px-2 py-1 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
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
