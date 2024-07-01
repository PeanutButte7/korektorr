import { IconShieldCheckeredFilled, IconShieldCheckFilled, IconSparkles } from "@tabler/icons-react";

const ProjectPage = () => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-16 mt-16">
      <div className="flex flex-col items-start gap-2 flex-shrink-0">
        <h1 className="text-primary text-4xl font-black">O projektu</h1>
        <h2 className="text-muted-foreground">Zjistěte více informací o této stránce.</h2>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-2 border p-4 rounded-lg">
          <h3 className="font-extrabold text-xl">Korektorr</h3>
          <p className="text-muted-foreground">
            Korektorr je webová aplikace, která umožňuje snadno a rychle opravit chyby v textu.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 border p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <IconShieldCheckFilled />
            <h3 className="font-extrabold text-xl">Soukromí na prvním místě</h3>
          </div>
          <p className="text-muted-foreground">
            Základní funkce Korektorru probíhají přímo ve vašem prohlížeči. Slova se kontrolují proti open-source{" "}
            <a href="http://www.translatoblog.cz/hunspell/" target="_blank" className="underline hover:no-underline">
              slovníku
            </a>
            , který vytvořil{" "}
            <a href="http://www.translatoblog.cz/o-mne/" target="_blank" className="underline hover:no-underline">
              Miroslav Pošta
            </a>
            . Tímto mu děkuji.
            <br />
            <br />
            Díky dnes rychlému přenosu dat je možné stáhnout tento slovník přímo do vašeho prohlížeče a veškerá slova
            proti němu kontrolovat, aniž by musely opustit váš počítač.
          </p>
        </div>
        {/*<div className="flex flex-col items-start gap-2 border p-4 rounded-lg">*/}
        {/*  <div className="flex gap-2 items-center">*/}
        {/*    <IconSparkles />*/}
        {/*    <h3 className="font-extrabold text-xl">AI funkce</h3>*/}
        {/*  </div>*/}
        {/*  <p className="text-muted-foreground">*/}
        {/*    Korektorr nabízí pokročilé AI funkce, které umožňují přesnější detekci chyb, včetně čárek. Vyzkoušení těchto*/}
        {/*    funkcí je možné zcela zdarma. Pro častější používaní je nutné si pořídit měsíční předplatné.*/}
        {/*    <br />*/}
        {/*    <br />*/}
        {/*    Při aktivaci těchto funkcí se text odesílá mimo váš prohlížeč.{" "}*/}
        {/*    <span className="underline">*/}
        {/*      Na těchto datech však nejsou AI modely trénovány a váš text se nikde trvale neukládá.*/}
        {/*    </span>*/}
        {/*  </p>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default ProjectPage;
