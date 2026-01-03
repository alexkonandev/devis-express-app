import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import db from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  // On attend bien le header (Fix Next 15)
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // NOTE : On ne déclare plus "session" ici globalement car le type change

  // CAS 1 : PREMIER PAIEMENT (L'objet est une SESSION)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Sécurité : Si pas d'info d'abonnement, on arrête
    if (!session.subscription) {
      return new NextResponse("Subscription ID is missing", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await db.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // CAS 2 : RENOUVELLEMENT MENSUEL (L'objet est une INVOICE)
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice; // <-- ICI C'EST UNE INVOICE

    // Sécurité : Si l'invoice n'est pas liée à un abo, on ignore
    if (!invoice.subscription) {
      return new NextResponse("No subscription found for this invoice", {
        status: 200,
      });
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );

    await db.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
