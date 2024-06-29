"use client";

import { useKorektorr } from "@/app/korektorr-context";
import { useState } from "react";

const Footer = () => {
  const { setDebug } = useKorektorr();
  const [count, setCount] = useState(0);

  return (
    <footer className="flex flex-col items-center justify-center gap-1 p-6 mt-8 text-center text-muted-foreground text-sm border-t">
      {/* Set debug mode after 5 clicks */}
      <p
        onClick={() =>
          setCount((prev) => {
            console.log(prev);
            if (prev > 5) {
              setDebug(true);
              return prev;
            }

            return prev + 1;
          })
        }
        className="text-muted-foreground/60 text-xs"
      >
        Vytvořil
      </p>
      <a href="https://www.adam-barta.com/" target="_blank" className="hover:underline">
        Adam Bárta
      </a>
    </footer>
  );
};

export default Footer;
