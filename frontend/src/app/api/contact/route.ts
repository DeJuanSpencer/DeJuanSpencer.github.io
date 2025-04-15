import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const emailRes = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New Portfolio Contact: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>New Message from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: emailRes.data?.id });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
