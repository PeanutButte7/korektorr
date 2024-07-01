"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-start gap-2 h-full flex-grow">
      <h2 className="text-primary text-4xl font-black">Jaj, něco se nepovedlo...</h2>
      <p className="text-muted-foreground">
        Vyskytla se chyba, kterou jsme neočekávali. Zkuste znovu načíst stránku. Pokud problém přetrvá, prosím{" "}
        <Link href="/kontakt" className="underline hover:no-underline">
          kontaktujte podporu.
        </Link>
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="mt-6"
      >
        Načíst stránku znovu
      </Button>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none text-muted-foreground">
          <AccordionTrigger>Zobrazit chybu</AccordionTrigger>
          <AccordionContent>
            <p>Chyba: {error.message}</p>
            <p>Stack trace: {error.stack}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
