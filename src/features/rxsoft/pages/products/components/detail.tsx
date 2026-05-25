import { JsonDetailCard } from "@/features/components/form/json-detail-card";

export function RxProductDetailsPage({ productId }: { productId: string }) {
  return (
    <JsonDetailCard
      title='Product Details'
      endpoint={`/products/${productId}`}
      backTo='/products'
      emptyLabel='GET /products/{productId}'
    />
  )
}