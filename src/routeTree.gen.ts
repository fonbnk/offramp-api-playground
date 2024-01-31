// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const OfferLazyImport = createFileRoute('/offer')()
const IndexLazyImport = createFileRoute('/')()
const StatusOrderIdLazyImport = createFileRoute('/status/$orderId')()
const PayOrderIdLazyImport = createFileRoute('/pay/$orderId')()

// Create/Update Routes

const OfferLazyRoute = OfferLazyImport.update({
  path: '/offer',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/offer.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const StatusOrderIdLazyRoute = StatusOrderIdLazyImport.update({
  path: '/status/$orderId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/status.$orderId.lazy').then((d) => d.Route),
)

const PayOrderIdLazyRoute = PayOrderIdLazyImport.update({
  path: '/pay/$orderId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/pay.$orderId.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/offer': {
      preLoaderRoute: typeof OfferLazyImport
      parentRoute: typeof rootRoute
    }
    '/pay/$orderId': {
      preLoaderRoute: typeof PayOrderIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/status/$orderId': {
      preLoaderRoute: typeof StatusOrderIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  OfferLazyRoute,
  PayOrderIdLazyRoute,
  StatusOrderIdLazyRoute,
])
