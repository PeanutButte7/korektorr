"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { IconBook2, IconCircleDashedX, IconFileDownload, IconSparkles, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { router } from "next/client";
import { animated, useTransition, config } from "@react-spring/web";
import { Separator } from "@/components/ui/separator";

const LoginSuccessBanner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newUser = searchParams.get("newUser");
  const [open, setOpen] = useState(newUser === "true");

  const transitions = useTransition(open, {
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    config: config.wobbly,
  });

  const handleClose = () => {
    setOpen(false);
    router.replace("/");
  };

  return transitions(
    (style, item) =>
      item && (
        <animated.div style={style} className="w-full">
          <div className="hidden md:flex items-center gap-4 justify-between py-2 px-3.5 bg-gradient-to-b from-emerald-600 to-emerald-800 border border-emerald-200 shadow-pop rounded-lg">
            <div className="w-full flex gap-2 items-center justify-between flex-wrap">
              <h3 className="text-white text-sm mr-1.5">Pokročilé funkce jsou aktivní!</h3>
              <div className="flex gap-2 items-center">
                <LoginPromoBannerPill>
                  <IconCircleDashedX />
                  Potlačení chyb
                </LoginPromoBannerPill>
                <Separator orientation="vertical" className="bg-emerald-300 h-3.5" />
                <LoginPromoBannerPill>
                  <IconBook2 />
                  Slovník povolených slov
                </LoginPromoBannerPill>
                <Separator orientation="vertical" className="bg-emerald-300 h-3.5" />
                <LoginPromoBannerPill>
                  <IconSparkles />
                  AI chytrá kontrola čárek (brzy)
                </LoginPromoBannerPill>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon-sm"
              className={"h-6 w-6 text-success-foreground hover:text-success-foreground/90 hover:bg-success/90"}
            >
              <IconX size={20} />
            </Button>
          </div>
        </animated.div>
      )
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
        "h-6 flex gap-2 items-center flex-shrink-0 text-success-foreground text-sm [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-emerald-100",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default LoginSuccessBanner;
