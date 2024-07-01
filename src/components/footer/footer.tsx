"use client";

import { useKorektorr } from "@/app/korektorr-context";
import { useEffect, useState } from "react";
import Link from "next/link";

const Footer = () => {
  const { setDebug } = useKorektorr();
  const [count, setCount] = useState(0);

  {
    /* Toggle debug mode after 5 clicks */
  }
  useEffect(() => {
    if (count > 5) {
      setDebug((prev) => !prev);
    }
  }, [count]);

  return (
    <footer className="flex flex-col items-center justify-center gap-2 p-6 mt-8 text-center text-muted-foreground text-sm border-t">
      <div className="flex gap-6">
        <Link href={"/projekt"} className="text-muted-foreground">
          O projektu
        </Link>
        <Link href={"/kontakt"} className="text-muted-foreground">
          Kontakt
        </Link>
        {/*<Link href={"/podminky"} className="text-muted-foreground">*/}
        {/*  Podmínky*/}
        {/*</Link>*/}
      </div>
      <p className="text-muted-foreground/70 text-xs">
        <a href="https://www.adam-barta.com/" target="_blank">
          Adam Bárta
        </a>{" "}
        <span
          onClick={() =>
            setCount((prev) => {
              if (prev > 5) {
                return 0;
              }

              return prev + 1;
            })
          }
        >
          © {new Date().getFullYear()}
        </span>
      </p>
    </footer>
  );
};

export default Footer;
