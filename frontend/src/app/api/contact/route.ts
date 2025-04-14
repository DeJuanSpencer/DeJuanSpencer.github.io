import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  // TODO: Integrate EmailJS, Resend, SendGrid, etc.
  console.log("New message:", { name, email, message });

  return NextResponse.json({ success: true });
}
