import { CSSProperties, ReactNode } from "react";
import { IconArrowNarrowRight, IconBook2, IconFileDownload, IconSparkles } from "@tabler/icons-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/cn";
import colors from "tailwindcss/colors";
import { Separator } from "@/components/ui/separator";

const LoginPromoBanner = () => {
  return (
    <div className="w-full hidden md:flex items-center justify-between gap-4 py-2 px-3.5 bg-blue-50 border border-blue-200 shadow-pop rounded-lg">
      <div className="w-full flex gap-2 items-center justify-between flex-wrap">
        <h3 className="text-primary text-base font-extrabold mr-1.5">Přihlašte se pro pokročilé funkce!</h3>
        <div className="flex gap-2 items-center">
          <LoginPromoBannerPill>
            <IconBook2 />
            Slovník povolených slov
          </LoginPromoBannerPill>
          <Separator orientation="vertical" className="bg-blue-300 h-3.5" />
          {/*<LoginPromoBannerPill>*/}
          {/*  <IconFileDownload />*/}
          {/*  Ukládání textu skrz zařízení*/}
          {/*</LoginPromoBannerPill>*/}
          {/*<div className="flex-shrink-0 bg-gradient-to-b from-sky-400/70 to-blue-700/70 p-[1px] rounded-[0.45rem]">*/}
          <LoginPromoBannerPill>
            <IconSparkles />
            AI chytrá kontrola čárek (brzy)
          </LoginPromoBannerPill>
          {/*</div>*/}
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
        "h-8 flex gap-2 items-center flex-shrink-0 text-blue-950 text-sm [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default LoginPromoBanner;
