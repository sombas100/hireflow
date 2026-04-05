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

    if (existingSubscriber) {
      if (!existingSubscriber.isSubscribed) {
        const updated = await prisma.subscriber.update({
          where: { email },
          data: {
            isSubscribed: true,
            unsubscribeToken: crypto.randomUUID(),
          },
        });

        const from = process.env.EMAIL_FROM;

        if (!from) {
          return NextResponse.json(
            {
              message:
                "Subscribed successfully, but welcome email is not configured yet.",
            },
            { status: 200 }
          );
        }

        try {
          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${updated.unsubscribeToken}`;

          const html = await render(
            SubscribeWelcomeEmail({
              userEmail: email,
              unsubscribeUrl,
            })
          );

          const result = await resend.emails.send({
            from,
            to: email,
            subject: "Welcome back to HireFlow job alerts",
            html,
          });

          console.log("Resend result:", result);

          if (result.error) {
            console.error("Resend send error:", result.error);

            return NextResponse.json(
              {
                message:
                  "Subscribed successfully, but the welcome email could not be sent.",
              },
              { status: 200 }
            );
          }
        } catch (emailError) {
          console.error("Email render/send threw:", emailError);

          return NextResponse.json(
            {
              message:
                "Subscribed successfully, but the welcome email could not be sent.",
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { message: "You’ve been re-subscribed successfully." },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "You’re already subscribed." },
        { status: 200 }
      );
    }

    const unsubscribeToken = crypto.randomUUID();

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        unsubscribeToken,
        isSubscribed: true,
      },
    });

    const from = process.env.EMAIL_FROM;

    if (!from) {
      console.error("Missing EMAIL_FROM environment variable");

      return NextResponse.json(
        {
          message:
            "Subscribed successfully, but welcome email is not configured yet.",
        },
        { status: 201 }
      );
    }

    try {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;

      const html = await render(
        SubscribeWelcomeEmail({
          userEmail: email,
          unsubscribeUrl,
        })
      );

      const result = await resend.emails.send({
        from,
        to: email,
        subject: "Welcome to HireFlow job alerts",
        html,
      });

      console.log("Resend result:", result);

      if (result.error) {
        console.error("Resend send error:", result.error);

        return NextResponse.json(
          {
            message:
              "Subscribed successfully, but the welcome email could not be sent.",
          },
          { status: 201 }
        );
      }
    } catch (emailError) {
      console.error("Email render/send threw:", emailError);

      return NextResponse.json(
        {
          message:
            "Subscribed successfully, but the welcome email could not be sent.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Subscribed successfully. Check your inbox." },
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