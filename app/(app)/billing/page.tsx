import { BillingClient } from "@/components/billing/billing-client";
import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit"; // Assure-toi que cette fonction existe

export default async function BillingPage() {
  const isPro = await checkSubscription();
  const apiLimitCount = await getApiLimitCount();

  return <BillingClient isPro={isPro} apiLimitCount={apiLimitCount} />;
}
