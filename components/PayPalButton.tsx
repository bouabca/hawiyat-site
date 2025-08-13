// components/PayPalPayButton.tsx
'use client';
import { CartItem } from '@/context/cart-context';
import { useState } from 'react';

export default function PayPalPayButton({ cart, total }: { cart: CartItem[], total: string }) {
  const [loading, setLoading] = useState(false);

  const safeCart = cart.map(item => ({
  id: item.id,
  quantity: item.quantity,
  offer: {
    id: item.offer.id,
    title: item.offer.title,
    description: item.offer.description,
    features: [...item.offer.features],
    provider: item.offer.provider,
    location: item.offer.location,
    useCase: [...item.offer.useCase],
    cpu: item.offer.cpu,
    ram: item.offer.ram,
    storage: item.offer.storage,
    bandwidth: item.offer.bandwidth,
    pricingTiers: item.offer.pricingTiers.map(tier => ({
      id: tier.id,
      billingCycle: tier.billingCycle,
      price: tier.price,
      currency: tier.currency,
      discountPercent: tier.discountPercent,
      displayPrice: tier.displayPrice,
    })),
  },
  selectedTier: {
    id: item.selectedTier.id,
    billingCycle: item.selectedTier.billingCycle,
    price: item.selectedTier.price,
    currency: item.selectedTier.currency,
    discountPercent: item.selectedTier.discountPercent,
    displayPrice: item.selectedTier.displayPrice,
  }
}));

  async function handleClick() {
    alert(total)
    setLoading(true);
    try {
      const res = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: safeCart, total }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      window.location.href = data.approveLink;
    } catch (e) {
      alert((e as {message: string}).message + " paypal-button");
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Redirecting…' : 'Pay with PayPal'}
    </button>
  );
}
