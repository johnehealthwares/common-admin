import { createFileRoute } from '@tanstack/react-router'
import { RxProductDetailsPage } from '@/features/rxsoft/pages'

export const Route = createFileRoute('/_authenticated/products/$productId')({
  component: ProductDetailsRoute,
})

function ProductDetailsRoute() {
  const { productId } = Route.useParams()
  return <RxProductDetailsPage productId={productId} />
}
