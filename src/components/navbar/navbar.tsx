import { createServerClient } from "@/utils/supabase/server";
import AvatarDropdown from "@/components/navbar/avatar-dropdown";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Navbar = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-center h-12 border-b border-gray-200">
      <div className="container flex items-center justify-between gap-2 xl:px-44 lg:px-16 ">
        <Link href="/" className="font-black text-3xl text-primary">
          Korektorr
        </Link>
        {data.user ? (
          <AvatarDropdown email={data.user?.email} />
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
