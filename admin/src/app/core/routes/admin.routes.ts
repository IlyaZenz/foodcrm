import { Routes } from '@angular/router'

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/_main/main-layout.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../layouts/pages/dashboard-page.component')
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../../layouts/pages/users/user-list.component'),
        // TODO add role guard
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('../../layouts/pages/users/user-item.component')
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: 'content',
        //TODO add role guard
        children: [
          {
            path: "",
            loadComponent: () =>
              import('../../layouts/pages/content/content-list.component'),
          },
          {
            path: 'banners',
            loadComponent: () => import('../../layouts/pages/content/banners/banners-list.component'),
            children: [
              {
                path: ':id',
                loadComponent: () => import('../../layouts/pages/content/banners/banner-item.component')
              },
              {
                path: '**',
                redirectTo: ''
              }
            ]
          },
        ]
      },
      {
        path: "categories",
        children: [
          {
            path: "",
            loadComponent: () =>
              import('../../layouts/pages/categories/category-list.component'),
          },
          {
            path: ":categoryUrl",
            loadComponent: () => import('../../layouts/pages/categories/products/product-list.component'),
            children: [
              {
                path: "",
                loadComponent: () => import('../../layouts/pages/categories/category-item.component')
              },
              {
                path: ":url",
                loadComponent: () => import('../../layouts/pages/categories/products/product-item.component')
              },
            ]
          }
        ]
      },
      {
        path: "orders",
        loadComponent: () =>
          import('../../layouts/pages/orders/order-list.component'),
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('../../layouts/pages/orders/order-item.component')
          },
          {
            path: '**',
            redirectTo: ''
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
