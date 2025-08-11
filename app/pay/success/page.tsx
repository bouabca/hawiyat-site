'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // This is the PayPal Order ID

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [captureData, setCaptureData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError('Missing order token.');
      setLoading(false);
      return;
    }
    
    async function captureOrder() {
      try {
        const res = await fetch('/api/payment/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: token }),
        });

        const data = await res.json();
        if (!data.ok) {
          throw new Error(data || 'Capture failed');
        }

        setCaptureData(data.capture);
      } catch (e: any) {

        setError(e.message || 'Unknown error');
      } finally {

        setLoading(false);
      }
    }

    captureOrder();
  }, [token]);

  if (loading) return <div className="w-full h-full"><p>Processing your payment...</p> </div>;
  if (error) return <div className="w-full h-full"><p className="mt-96" style={{ color: 'red' }}>Error: {error}</p> </div>;

  return (
    <div className="m-auto">
      <h1>✅ Payment Successful!</h1>
      <pre>{JSON.stringify(captureData, null, 2)}</pre>
      {/* Show receipt info, order details, etc. */}
    </div>
  );
}
