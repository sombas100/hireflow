import { prisma } from "@/lib/prisma";

type UnsubscribePageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid unsubscribe link</h1>
          <p className="text-slate-300">
            This unsubscribe link is missing or invalid.
          </p>
        </div>
      </main>
    );
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!subscriber) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Link not recognised</h1>
          <p className="text-slate-300">
            We could not find a subscription matching this link.
          </p>
        </div>
      </main>
    );
  }

  if (!subscriber.isSubscribed) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Already unsubscribed</h1>
          <p className="text-slate-300">
            This email address is already unsubscribed from HireFlow job alerts.
          </p>
        </div>
      </main>
    );
  }

  await prisma.subscriber.update({
    where: { unsubscribeToken: token },
    data: { isSubscribed: false },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">You’ve been unsubscribed</h1>
        <p className="text-slate-300 mb-6">
          You will no longer receive HireFlow job alert emails.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Back to HireFlow
        </a>
      </div>
    </main>
  );
}
