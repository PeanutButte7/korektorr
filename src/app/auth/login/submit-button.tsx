import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { IconLogin2 } from "@tabler/icons-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} variant="fancy" className="w-full">
      Přihlásit se
      <IconLogin2 />
    </Button>
  );
};

export default SubmitButton;
