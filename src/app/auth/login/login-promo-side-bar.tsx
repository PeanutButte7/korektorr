import { ReactNode } from "react";
import { IconBook2, IconCircleDashedX, IconFileDownload, IconSparkles } from "@tabler/icons-react";

const LoginPromoSideBar = () => {
  return (
    <div className="w-96 flex flex-col gap-4 px-6 py-6 bg-gradient-to-b from-card to-blue-50 border border-blue-200 rounded-lg shadow-pop">
      <h2 className="font-extrabold text-blue-400 text-2xl">Přihlášením získáte</h2>
      <div className="flex flex-col gap-4">
        <LoginPromoSideBarCard
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 27C24.7956 27 25.5587 27.3161 26.1213 27.8787C26.6839 28.4413 27 29.2044 27 30C27 29.2044 27.3161 28.4413 27.8787 27.8787C28.4413 27.3161 29.2044 27 30 27C29.2044 27 28.4413 26.6839 27.8787 26.1213C27.3161 25.5587 27 24.7956 27 24C27 24.7956 26.6839 25.5587 26.1213 26.1213C25.5587 26.6839 24.7956 27 24 27ZM24 9C24.7956 9 25.5587 9.31607 26.1213 9.87868C26.6839 10.4413 27 11.2044 27 12C27 11.2044 27.3161 10.4413 27.8787 9.87868C28.4413 9.31607 29.2044 9 30 9C29.2044 9 28.4413 8.68393 27.8787 8.12132C27.3161 7.55871 27 6.79565 27 6C27 6.79565 26.6839 7.55871 26.1213 8.12132C25.5587 8.68393 24.7956 9 24 9ZM13.5 27C13.5 24.6131 14.4482 22.3239 16.136 20.636C17.8239 18.9482 20.1131 18 22.5 18C20.1131 18 17.8239 17.0518 16.136 15.364C14.4482 13.6761 13.5 11.3869 13.5 9C13.5 11.3869 12.5518 13.6761 10.864 15.364C9.17613 17.0518 6.88695 18 4.5 18C6.88695 18 9.17613 18.9482 10.864 20.636C12.5518 22.3239 13.5 24.6131 13.5 27Z"
                stroke="url(#paint0_linear_38_5679)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_38_5679"
                  x1="17.25"
                  y1="6"
                  x2="17.25"
                  y2="30"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </svg>
          }
          title="AI Chytrá oprava textu (brzy)"
          description="Kontrolujte čárky a další záludné chyby ve slovech pomocí chytré AI opravy textu.*"
        />
        <LoginPromoSideBarCard
          icon={<IconBook2 size={36} className="text-primary" />}
          title="Slovník povolených slov"
          description="Uložte si slova, která nemá Korektorr počítat jako chyby."
        />
        <LoginPromoSideBarCard
          icon={<IconCircleDashedX size={36} className="text-primary" />}
          title="Potlačení chyb"
          description="Skryjte označené chyby, které považujete za nesprávné nebo rušivé."
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
    <div className="flex flex-col p-6 gap-1.5 bg-card shadow-pop rounded-lg border-y border-gray-100">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="font-paragraph text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default LoginPromoSideBar;
