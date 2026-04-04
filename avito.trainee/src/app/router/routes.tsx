import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import { AdEditPage } from '@/pages/ads/AdEditPage'
import AdsListPage from '@/pages/ads/AdsListPage'
import { AdViewPage } from '@/pages/ads/AdViewPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Outlet />
      </QueryParamProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/ads" replace />,
      },
      {
        path: 'ads',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <AdsListPage />,
          },
          {
            path: ':id',
            element: <Outlet />,
            children: [
              { index: true, element: <AdViewPage /> },
              { path: 'edit', element: <AdEditPage /> },
            ],
          },
        ],
      },
    ],
  },
])
