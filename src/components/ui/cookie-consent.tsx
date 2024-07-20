"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { CookieIcon } from "@radix-ui/react-icons";
import posthog from "posthog-js";

const CookieConsent = ({ onAcceptCallback = () => {}, onDeclineCallback = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(true);

  const accept = () => {
    setIsOpen(false);
    localStorage.setItem("cookie_consent", "yes");
    posthog.set_config({ persistence: "localStorage+cookie" });

    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    localStorage.setItem("cookie_consent", "no");
    posthog.set_config({ persistence: "memory" });

    setTimeout(() => {
      setHide(true);
    }, 700);

    onDeclineCallback();
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie_consent")) {
        setIsOpen(true);
        setTimeout(() => {
          setHide(false);
        }, 700);
      }
    } catch (e) {
      // console.log("Error: ", e);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed z-[200] bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md duration-700",
        !isOpen
          ? "transition-[opacity,transform] translate-y-8 opacity-0"
          : "transition-[opacity,transform] translate-y-0 opacity-100",
        hide && "hidden"
      )}
    >
      <div className="bg-background rounded-md m-3 border border-border shadow-lg">
        <div className="grid gap-2">
          <div className="border-b border-border h-14 flex items-center justify-between p-4">
            <h1 className="text-lg font-medium">Používáme cookies</h1>
            <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
          </div>
          <div className="p-4">
            <p className="text-sm font-normal text-start font-paragraph">
              Abychom mohli vylepšovat tuto stránku, používáme cookies. Udělením souhlasu, souhlasíte se sdílením vaší
              aktivity na této stránce.
              <br />
              <br />
              <u>Žádný obsah vaše textového editoru však nebude přenášen.</u>
              <br />
              <br />
              <span>
                Kliknutím na"<span className="font-medium opacity-80">Přijmout</span>", souhlasíte s používáním cookies.
              </span>
            </p>
          </div>
          <div className="flex gap-2 p-4 py-5 border-t border-border">
            <Button onClick={accept} className="w-full">
              Přijmout
            </Button>
            <Button onClick={decline} className="w-full" variant="outline">
              Odmítnout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CookieConsent };
