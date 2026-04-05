import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type SubscribeWelcomeEmailProps = {
  userEmail: string;
  unsubscribeUrl: string;
};

export default function SubscribeWelcomeEmail({
  userEmail,
  unsubscribeUrl,
}: SubscribeWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You’re subscribed to HireFlow job alerts</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={heroSection}>
            <Text style={eyebrow}>HireFlow</Text>
            <Heading style={heading}>You’re in 🎉</Heading>
            <Text style={subheading}>
              Thanks for subscribing to HireFlow. You’ll be the first to hear
              about new junior and entry-level developer roles.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={bodyText}>What to expect:</Text>

            <Text style={listItem}>
              • Junior and entry-level developer jobs only
            </Text>
            <Text style={listItem}>
              • Relevant roles without senior-level noise
            </Text>
            <Text style={listItem}>• Links straight to the live listings</Text>

            <Button href="https://www.hireflowjobs.io/jobs" style={button}>
              Browse HireFlow
            </Button>

            <Text style={unsubscribe}>
              No spam.{" "}
              <a href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </a>{" "}
              at any time.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={footer}>This email was sent to {userEmail}.</Text>
            <Text style={footer}>
              HireFlow helps junior developers find relevant opportunities
              faster.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f7fb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "24px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const heroSection = {
  backgroundColor: "#0f172a",
  padding: "40px 32px 28px",
};

const eyebrow = {
  color: "#ef4444",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const heading = {
  color: "#ffffff",
  fontSize: "32px",
  lineHeight: "1.2",
  fontWeight: "800",
  margin: "0 0 12px",
};

const subheading = {
  color: "#d1d5db",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
};

const card = {
  padding: "32px",
};

const bodyText = {
  color: "#111827",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 12px",
  fontWeight: "600",
};

const listItem = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 8px",
};

const button = {
  display: "inline-block",
  marginTop: "24px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "14px 22px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "14px",
};

const unsubscribe = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "16px",
};

const unsubscribeLink = {
  color: "#2563eb",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "16px 32px",
};
