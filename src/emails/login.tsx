import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const LoginEmail = () => (
  <Html>
    <Head />
    <Preview>Přihášení do Korektorru</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`${baseUrl}/png/logo.png`} width="42" height="42" alt="Korektorr" style={logo} />
        <Heading style={heading}>Přihlašte se do Korektorru</Heading>
        <Section style={buttonContainer}>
          <Button style={button} href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">
            Přihlásit se
          </Button>
        </Section>
        <Text style={paragraph}>
          Tento odkaz je jednorázový a bude platný pouze 5 minut. Přihlásí vás do prohlížeče, ve kterém se otevře.
        </Text>
        <Text style={paragraph}>
          Pokud se chcete přihlásit v jiném prohlížeči, můžete do něj přímo zkopírovat odkaz níže.
        </Text>
        <code style={code}>{"{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink"}</code>
        <Hr style={hr} />
        <Link href="https://korektorr.cz" style={reportLink}>
          Korektorr
        </Link>
      </Container>
    </Body>
  </Html>
);

export default LoginEmail;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#FAFAF9",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "800",
  color: "#171717",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#171717",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#d4d4d4",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "42px 0 26px",
};

const code = {
  fontFamily: "monospace",
  padding: "1px 4px",
  backgroundColor: "#e5e5e5",
  letterSpacing: "-0.3px",
  fontSize: "14px",
  borderRadius: "4px",
  color: "#171717",
};
