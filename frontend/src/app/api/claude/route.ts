import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const FREE_TIER_LIMIT = 50;

function makeSupabaseClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  // 1. Require a valid session token
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = makeSupabaseClient(token);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check tier and enforce monthly call cap
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("user_id", user.id)
    .maybeSingle();

  const tier: string = profile?.tier ?? "free";

  if (tier === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= FREE_TIER_LIMIT) {
      return NextResponse.json(
        {
          error: "monthly_limit_reached",
          message: `You've used all ${FREE_TIER_LIMIT} free AI calls this month. Upgrade to Pro for unlimited access.`,
        },
        { status: 429 }
      );
    }
  }

  // 3. Proxy to Anthropic
  try {
    const body = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    // 4. Log usage (fire-and-forget — don't delay the response)
    supabase
      .from("usage_events")
      .insert({ user_id: user.id, event_type: "claude_call" })
      .then(({ error: insertErr }) => {
        if (insertErr) console.error("Usage insert failed:", insertErr);
      });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Claude proxy error:", error);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
