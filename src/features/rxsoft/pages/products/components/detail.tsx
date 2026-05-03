import { JsonDetailCard } from "../../../../components/json-detail-card";

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