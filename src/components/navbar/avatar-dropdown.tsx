"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";
import { createBrowserClient } from "@/utils/supabase/browser";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/utils/queries";
import Link from "next/link";

const AvatarDropdown = () => {
  const supabase = createBrowserClient();
  const router = useRouter();

  const { data, isSuccess } = useGetProfile(supabase);

  // const handleCheckout = async () => {
  //   // Create a checkout and open the checkout page in a new tab.
  //   let checkoutUrl: string | undefined = "";
  //
  //   try {
  //     checkoutUrl = await getCheckoutUrl();
  //   } catch (error) {
  //     console.error("Error creating checkout:", error);
  //   }
  //
  //   router.push(checkoutUrl ?? "/");
  // };

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
        <DropdownMenuItem
          asChild
          className="flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors hover:no-underline"
        >
          <Link href="/profil">Profil a předplatné</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center rounded-md px-2 py-1 transition-colors"
          onSelect={() => supabase.auth.signOut().then(() => window.location.reload())}
        >
          <IconLogout className="mr-2 h-4 w-4" />
          Odhlásit se
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
