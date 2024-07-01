import { Button } from "@/components/ui/button";
import { IconBrandX, IconGlobe, IconMail, IconWorld } from "@tabler/icons-react";

const ContactPage = () => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-16 mt-16">
      <div className="flex flex-col items-start gap-2 flex-shrink-0">
        <h1 className="text-primary text-4xl font-black">Kontakt</h1>
        <h2 className="text-muted-foreground">Kontaktujte člověka za projektem přímo.</h2>
      </div>
      <div className="w-full flex flex-col items-start gap-1 rounded-lg p-4 border">
        <h3 className="font-extrabold text-xl">Adam Bárta</h3>
        <p className="flex gap-2 items-center text-primary">
          <IconMail size={18} />
          adam.barta404@gmail.com
        </p>
        <a href="https://x.com/AdamBartas" target="_blank" className="flex gap-2 items-center">
          <IconBrandX size={18} />
          @adambartas
        </a>
        <a href="https://www.adam-barta.com/" target="_blank" className="flex gap-2 items-center">
          <IconWorld size={18} />
          adam-barta.com
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
