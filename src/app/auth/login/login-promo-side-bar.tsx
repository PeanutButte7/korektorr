import { ReactNode } from "react";
import { IconBook2, IconFileDownload, IconSparkles } from "@tabler/icons-react";

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
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 27C7.5 27.7956 7.81607 28.5587 8.37868 29.1213C8.94129 29.6839 9.70435 30 10.5 30H28.5V6H10.5C9.70435 6 8.94129 6.31607 8.37868 6.87868C7.81607 7.44129 7.5 8.20435 7.5 9V27ZM7.5 27C7.5 26.2044 7.81607 25.4413 8.37868 24.8787C8.94129 24.3161 9.70435 24 10.5 24H28.5M13.5 12H22.5"
                stroke="url(#paint0_linear_38_5694)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_38_5694"
                  x1="18"
                  y1="6"
                  x2="18"
                  y2="30"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </svg>
          }
          title="Slovník povolených slov"
          description="Uložte si slova, která nemá Korektorr počítat jako chyby."
        />
        <LoginPromoSideBarCard
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 4.5V10.5C21 10.8978 21.158 11.2794 21.4393 11.5607C21.7206 11.842 22.1022 12 22.5 12H28.5M21 4.5H10.5C9.70435 4.5 8.94129 4.81607 8.37868 5.37868C7.81607 5.94129 7.5 6.70435 7.5 7.5V28.5C7.5 29.2956 7.81607 30.0587 8.37868 30.6213C8.94129 31.1839 9.70435 31.5 10.5 31.5H25.5C26.2956 31.5 27.0587 31.1839 27.6213 30.6213C28.1839 30.0587 28.5 29.2956 28.5 28.5V12M21 4.5L28.5 12M18 25.5V16.5M18 25.5L14.25 21.75M18 25.5L21.75 21.75"
                stroke="url(#paint0_linear_38_5689)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_38_5689"
                  x1="18"
                  y1="4.5"
                  x2="18"
                  y2="31.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#1E40AF" />
                </linearGradient>
              </defs>
            </svg>
          }
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
    <div className="flex flex-col p-6 gap-1.5 bg-card shadow-pop rounded-lg border-y border-gray-100">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="font-paragraph text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default LoginPromoSideBar;
