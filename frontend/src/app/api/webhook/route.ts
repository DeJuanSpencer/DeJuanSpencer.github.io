import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function upgradeUserTier(userId: string | null, email: string | null) {
  const supabase = getSupabaseAdmin();

  if (userId) {
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: userId, tier: "pro" }, { onConflict: "user_id" });
    if (error) console.error("Supabase tier upgrade failed (userId):", error);
    return;
  }

  if (email) {
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Failed to list users:", listError);
      return;
    }
    const match = data?.users.find((u) => u.email === email);
    if (match) {
      const { error } = await supabase
        .from("profiles")
        .upsert({ user_id: match.id, tier: "pro" }, { onConflict: "user_id" });
      if (error) console.error("Supabase tier upgrade failed (email):", error);
    } else {
      console.warn("No Supabase user found for email:", email);
    }
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || null;
    const email = session.customer_email ?? session.metadata?.email ?? null;

    console.log("Payment completed:", { sessionId: session.id, email, userId });

    await upgradeUserTier(userId, email);
  }

  return NextResponse.json({ received: true });
}
