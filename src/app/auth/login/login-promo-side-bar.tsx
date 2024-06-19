import { ReactNode } from "react";
import { IconBook2, IconFileDownload, IconSparkles } from "@tabler/icons-react";

const LoginPromoSideBar = () => {
  return (
    <div className="w-96 flex flex-col gap-4 px-6 py-6 bg-gradient-to-b from-card to-blue-50 border border-blue-200 rounded-lg shadow-pop">
      <h2 className="font-extrabold text-blue-400 text-2xl">Přihlášením získáte</h2>
      <div className="flex flex-col gap-4">
        <LoginPromoSideBarCard
          icon={<IconSparkles />}
          title="AI Chytrá oprava textu"
          description="Kontrolujte čárky a další záludné chyby ve slovech pomocí chytré AI opravy textu.*"
        />
        <LoginPromoSideBarCard
          icon={<IconBook2 />}
          title="Slovník povolených slov"
          description="Uložte si slova, která nemá Korektorr počítat jako chyby."
        />
        <LoginPromoSideBarCard
          icon={<IconFileDownload />}
          title="Ukládání textu skrz zařízení"
          description="Už nikdy nepřijdete o svůj text. Bude se vám navíc sdílet napříč všemi přihlášenými zařízeními."
        />
      </div>
      <p className="font-paragraph text-xs text-gray-400">*Chytrá oprava je v neplacené verzi omezena.</p>
    </div>
  );
};

const LoginPromoSideBarCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col p-6 gap-1.5 bg-card shadow-pop rounded-md border-y border-gray-100">
      <div className="[&>svg]:h-7 [&>svg]:w-7">{icon}</div>
      <h3 className="font-bold text-lg text-gray-700">{title}</h3>
      <p className="font-paragraph text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default LoginPromoSideBar;
