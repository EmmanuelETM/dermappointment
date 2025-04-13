type SearchParams = Promise<{
  amount: string;
}>;

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const amount = (await searchParams).amount;
  return (
    <main className="rouded-md m-10 mx-auto max-w-6xl border p-10 text-center">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold">Thank you!</h1>
        <h2 className="text-xl">You successfully sent</h2>
        <div className="rounded-md p-2 text-2xl font-bold">${amount}</div>
      </div>
    </main>
  );
}
