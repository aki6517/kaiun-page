export function PayButtonSlot() {
  const isPayPalConfigured = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

  return (
    <section
      className="mt-10 border border-[#D9C08F] bg-[#FDFBF7] px-6 py-7 text-center"
      aria-label="PayPalのお支払い受付"
      data-paypal-client-id={isPayPalConfigured ? "configured" : "missing"}
    >
      <p className="text-base leading-8 text-[#4A3F3B]">お支払いの受付は準備中です。もう少しだけお待ちください。</p>
    </section>
  );
}
