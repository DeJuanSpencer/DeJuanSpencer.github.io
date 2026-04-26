import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "https://dejuanspencer.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/prompt-engine?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/prompt-engine?canceled=true`,
      metadata: {
        userId: userId ?? "",
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
