import { createServerClient } from "@/utils/supabase/server";
import { getSubscription } from "@/app/profil/getSubscription";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";

const ProfilePage = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();

  const translationMap = {
    active: "Aktivní",
    on_trial: "Zkušební verze",
    cancelled: "Zrušeno",
    paused: "Pozastaveno",
    past_due: "Po splatnosti",
    unpaid: "Nezaplaceno",
    expired: "Platnost vypršela",
  };

  if (!data || !data.user) return null;
  const subscriptions = await getSubscription(supabase, data.user.id);

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-16 mt-16">
      <div className="flex flex-col items-start gap-2 flex-shrink-0">
        <h1 className="text-primary text-4xl font-black">Profil</h1>
        <h2 className="text-muted-foreground">Upravte váš profil. Zobrazte a spravujte své předplatné.</h2>
      </div>
      <div className="flex flex-col gap-6 flex-grow">
        <div className="flex flex-col items-start gap-2 border p-4 rounded-lg w-full">
          <h3 className="font-extrabold text-xl">Email</h3>
          <p className="text-muted-foreground">{data.user.email}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-extrabold text-xl text-muted-foreground">Předplatné</h3>
          {subscriptions.map(({ id, attributes }) => (
            <div key={id} className="flex flex-col items-start gap-2 border p-4 rounded-lg w-full">
              <h3 className="font-extrabold text-xl">{attributes.product_name}</h3>
              <div className="flex gap-2 justify-between w-full items-end text-sm text-muted-foreground">
                <div className="flex gap-2 items-center">
                  <p
                    className={cn(
                      "px-2 py-1 border rounded-lg text-xs",
                      attributes.status === "active" || attributes.status === "on_trial"
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                    )}
                  >
                    {/* @ts-ignore */}
                    {translationMap[attributes.status]}
                  </p>
                  {attributes.ends_at ? (
                    <p>Končí: {new Date(attributes.ends_at).toLocaleDateString("cs-CZ")}</p>
                  ) : (
                    <p>Obnoví se: {new Date(attributes.renews_at).toLocaleDateString("cs-CZ")}</p>
                  )}
                </div>
                <a
                  href={attributes.urls.customer_portal}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Upravit <ExternalLinkIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
