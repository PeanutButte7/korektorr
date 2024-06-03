import { createServerClient } from "@/utils/supabase/server";
import AvatarDropdown from "@/components/navbar/avatar-dropdown";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Navbar = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();
  console.log("Data", data);

  return (
    <div className="flex items-center justify-end h-14 px-4 border-b border-slate-200 dark:border-slate-800">
      {data.user ? (
        <AvatarDropdown email={data.user?.email} />
      ) : (
        <Link href={"/auth/login"} className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
