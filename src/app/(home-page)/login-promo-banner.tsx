import { CSSProperties, ReactNode } from "react";
import { IconBook2, IconFileDownload, IconSparkles } from "@tabler/icons-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/cn";
import colors from "tailwindcss/colors";

const LoginPromoBanner = () => {
  return (
    <div className="flex items-center justify-between py-2 px-3.5 bg-blue-50 border border-blue-200 shadow-pop rounded-lg">
      <div className="flex gap-2 items-center">
        <h3 className="text-primary text-base font-extrabold mr-1.5">Aktivujte pokročilé funkce!</h3>
        <LoginPromoBannerPill>
          <IconBook2 />
          Slovník povolených slov
        </LoginPromoBannerPill>
        <LoginPromoBannerPill>
          <IconFileDownload />
          Ukládání textu skrz zařízení
        </LoginPromoBannerPill>
        <div className="bg-gradient-to-b from-sky-400/70 to-blue-700/70 p-[1px] rounded-[0.45rem]">
          <LoginPromoBannerPill className="h-[30px] border-none">
            <IconSparkles />
            AI chytrá kontrola čárek
          </LoginPromoBannerPill>
        </div>
      </div>
      <Link href={"/auth/login"} className={buttonVariants({ variant: "fancy", size: "sm" })}>
        Přihlásit se
      </Link>
    </div>
  );
};

const LoginPromoBannerPill = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={cn(
        "h-8 flex gap-2 items-center bg-background text-blue-950 rounded-md border border-blue-200 py-1 px-3 text-sm [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default LoginPromoBanner;
