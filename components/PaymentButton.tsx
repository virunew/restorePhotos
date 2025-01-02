import { useState } from 'react';
import Script from 'next/script';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
}

const getCreditsFromAmount = (amount: number): number => {
  switch (amount) {
    case 1000: return 75;
    case 3000: return 200;
    case 5000: return 350;
    default: return 0;
  };
};

export default function PaymentButton({ amount }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {}
        }),
      });
      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'RestorePhotos',
        description: `Purchase ${getCreditsFromAmount(amount)} photo restoration credits`,
        order_id: order.id,
        prefill: {
          name: session?.user?.name || 'User',
          email: session?.user?.email || 'user@example.com',
        },
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            });
            
            if (verifyResponse.ok) {
              alert('Payment successful!');
              // You might want to redirect or update UI here
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Payment verification failed');
          }
        },
        theme: {
          color: '#2563eb', // blue-600
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </>
  );
} 