import { SaleSession } from '../types';

export function getUomEffectiveFactor(uom: { uomType?: string; factor: number } | null | undefined): number {
  if (!uom) return 1;
  if (uom.uomType === 'smaller') return 1 / uom.factor;
  return uom.factor;
}

export function calculateTotals(session: SaleSession) {
  const subtotal = session.cart.reduce((sum, item) => {
    const price = session.pricingMode === 'wholesale' ? item.wholesalePrice : item.retailPrice;
    return sum + price * item.quantity * item.uomFactor;
  }, 0);

  const discount = subtotal * (session.discount / 100);
  const taxable = subtotal - discount;
  const vat = taxable * (session.vatPercent / 100);
  const total = taxable + vat;

  return { subtotal, discount, vat, total };
}
