import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import SubscribeWelcomeEmail from "@/lib/emails/SubscribeWelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendWelcomeEmail({
  email,
  unsubscribeToken,
  subject,
}: {
  email: string;
  unsubscribeToken: string;
  subject: string;
}) {
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!from) {
    return {
      success: false,
      message: "Subscribed successfully, but welcome email is not configured yet.",
    };
  }

  if (!appUrl) {
    return {
      success: false,
      message: "Subscribed successfully, but app URL is not configured yet.",
    };
  }

  try {
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${unsubscribeToken}`;

    const html = await render(
      SubscribeWelcomeEmail({
        userEmail: email,
        unsubscribeUrl,
      })
    );

    const result = await resend.emails.send({
      from,
      to: email,
      subject,
      html,
    });

    console.log("Resend result:", result);

    if (result.error) {
      console.error("Resend send error:", result.error);

      return {
        success: false,
        message:
          "Subscribed successfully, but the welcome email could not be sent.",
      };
    }

    return {
      success: true,
      message: "Subscribed successfully. Check your inbox.",
    };
  } catch (error) {
    console.error("Email render/send threw:", error);

    return {
      success: false,
      message:
        "Subscribed successfully, but the welcome email could not be sent.",
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber?.isSubscribed) {
      return NextResponse.json(
        { message: "You’re already subscribed." },
        { status: 200 }
      );
    }

    if (existingSubscriber && !existingSubscriber.isSubscribed) {
      const updatedSubscriber = await prisma.subscriber.update({
        where: { email },
        data: {
          isSubscribed: true,
          unsubscribeToken: crypto.randomUUID(),
        },
      });

      const emailResult = await sendWelcomeEmail({
        email,
        unsubscribeToken: updatedSubscriber.unsubscribeToken,
        subject: "Welcome back to HireFlow job alerts",
      });

      return NextResponse.json(
        {
          message: emailResult.success
            ? "You’ve been re-subscribed successfully. Check your inbox."
            : emailResult.message,
        },
        { status: 200 }
      );
    }

    const newSubscriber = await prisma.subscriber.create({
      data: {
        email,
        isSubscribed: true,
        unsubscribeToken: crypto.randomUUID(),
      },
    });

    const emailResult = await sendWelcomeEmail({
      email,
      unsubscribeToken: newSubscriber.unsubscribeToken,
      subject: "Welcome to HireFlow job alerts",
    });

    return NextResponse.json(
      { message: emailResult.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while subscribing." },
      { status: 500 }
    );
  }
}