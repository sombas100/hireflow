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
      message: "Subscription updated, but email sending is not configured yet.",
    };
  }

  if (!appUrl) {
    return {
      success: false,
      message: "Subscription updated, but app URL is not configured yet.",
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
          "Subscription updated, but the welcome email could not be sent.",
      };
    }

    return {
      success: true,
      message: "A fresh email has been sent to your inbox.",
    };
  } catch (error) {
    console.error("Email render/send threw:", error);

    return {
      success: false,
      message:
        "Subscription updated, but the welcome email could not be sent.",
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

    const freshToken = crypto.randomUUID();

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    let subscriber;
    let subject = "Welcome to HireFlow job alerts";
    let status = 201;

    if (!existingSubscriber) {
      subscriber = await prisma.subscriber.create({
        data: {
          email,
          isSubscribed: true,
          unsubscribeToken: freshToken,
        },
      });
    } else {
      subscriber = await prisma.subscriber.update({
        where: { email },
        data: {
          isSubscribed: true,
          unsubscribeToken: freshToken,
        },
      });

      subject = existingSubscriber.isSubscribed
        ? "Your fresh HireFlow job alert link"
        : "Welcome back to HireFlow job alerts";

      status = 200;
    }

    const emailResult = await sendWelcomeEmail({
      email,
      unsubscribeToken: subscriber.unsubscribeToken,
      subject,
    });

    return NextResponse.json(
      {
        message: emailResult.success
          ? !existingSubscriber
            ? "Subscribed successfully. Check your inbox."
            : !existingSubscriber.isSubscribed
            ? "You’ve been re-subscribed successfully. Check your inbox."
            : "You’re already subscribed. We’ve sent you a fresh email."
          : emailResult.message,
      },
      { status }
    );
  } catch (error) {
    console.error("Subscribe route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while subscribing." },
      { status: 500 }
    );
  }
}