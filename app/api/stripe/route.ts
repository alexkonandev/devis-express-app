import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

// URL de retour après paiement ou annulation

const settingsUrl = absoluteUrl("/billing?success=1");

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. On cherche si l'utilisateur a déjà un abonnement en base
    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // CAS A : L'utilisateur a déjà un ID client Stripe (Il est ou a été abonné)
    if (userSubscription && userSubscription.stripeCustomerId) {
      // On ouvre le "Portail Billing" de Stripe pour gérer l'abo
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // CAS B : C'est un nouveau client (Première fois)
    // On crée une session de Checkout (Paiement)
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl, // Où on va si succès
      cancel_url: settingsUrl, // Où on va si on annule
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress, // Pré-remplit l'email
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: "DevisExpress - Plan Empire",
              description: "Facturation illimitée & Marque Blanche",
            },
            unit_amount: 900, // 9.00 EUR (Stripe compte en centimes)
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      // CRUCIAL : On passe l'ID de l'user dans les métadonnées
      // C'est ce qui permettra au Webhook de savoir QUI a payé
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
