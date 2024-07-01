import { createServerClient } from "@/utils/supabase/server";
import AvatarDropdown from "@/components/navbar/avatar-dropdown";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { IconBook2 } from "@tabler/icons-react";

const Navbar = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-center h-12 border-b border-gray-200">
      <div className="container flex items-center justify-between gap-2 xl:px-44 lg:px-16 ">
        <Link href="/" className="font-black text-3xl text-primary hover:no-underline">
          Korektorr
        </Link>
        {data.user ? (
          <div className="flex gap-2">
            <Link href="/slovnik" className={buttonVariants({ variant: "outline" })}>
              Slovník
              <IconBook2 />
            </Link>
            <AvatarDropdown email={data.user?.email} />
          </div>
        ) : (
          <Link href={"/auth/login"} className={buttonVariants({ variant: "outline" })}>
            Přihlásit se
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
