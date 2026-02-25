import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Asegúrate de que la ruta sea correcta

export const routes: Routes = [

  // Redireccionamiento inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Rutas protegidas
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/product.routes').then(c => c.PRODUCTS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'products-edit/:id',
    loadComponent: () => import('./features/products/product-edit/product-edit.component').then(c => c.ProductEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products-create',
    loadComponent: () => import('./features/products/product-create/product-create.component').then(c => c.ProductCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products-list',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(c => c.ProductListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products-show/:id',
    loadComponent: () => import('./features/products/product-show/product-show.component').then(c => c.ProductShowComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'users',
    loadChildren: () => import('./features/users/user.routes').then(c => c.USERS_ROUTES),
    canActivate: [AuthGuard]
  },
    {
    path: 'users-edit/:id',
    loadComponent: () => import('./features/users/user-edit/user-edit.component').then(c => c.UserEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users-create',
    loadComponent: () => import('./features/users/user-create/user-create.component').then(c => c.UserCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'users-list',
    loadComponent: () => import('./features/users/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users-show/:id',
    loadComponent: () => import('./features/users/user-show/user-show.component').then(c => c.UserShowComponent),
    canActivate: [AuthGuard]
  },

  // Ruta pública: login
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },

  // Página 404 (puedes dejarla libre)
 
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/client.routes').then(c => c.CLIENTS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-edit/:id',
    loadComponent: () => import('./features/clients/client-edit/client-edit.component').then(c => c.ClientEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-create',
    loadComponent: () => import('./features/clients/client-create/client-create.component').then(c => c.ClientCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-list',
    loadComponent: () => import('./features/clients/client-list/client-list.component').then(c => c.ClientListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-show/:id',
    loadComponent: () => import('./features/clients/client-show/client-show.component').then(c => c.ClientShowComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'locations',
    loadChildren: () => import('./features/locations/location.routes').then(c => c.LOCATIONS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'locations-edit/:id',
    loadComponent: () => import('./features/locations/location-edit/location-edit.component').then(c => c.LocationEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'locations-show/:id',
    loadComponent: () => import('./features/locations/location-show/location-show.component').then(c => c.LocationShowComponent),
    canActivate: [AuthGuard]
  },
   {
    path: 'locations-list',
    loadComponent: () => import('./features/locations/location-list/location-list.component').then(c => c.LocationListComponent),
    canActivate: [AuthGuard]
  }, 

    {
    path: 'locations-create',
    loadComponent: () => import('./features/locations/location-create/location-create.component').then(c => c.LocationCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./features/suppliers/supplier.routes').then(c => c.SUPPLIERS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers-edit/:id',
    loadComponent: () => import('./features/suppliers/supplier-edit/supplier-edit.component').then(c => c.SupplierEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers-create',
    loadComponent: () => import('./features/suppliers/supplier-create/supplier-create.component').then(c => c.SupplierCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers-list',
    loadComponent: () => import('./features/suppliers/supplier-list/supplier-list.component').then(c => c.SupplierListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers-show/:id',
    loadComponent: () => import('./features/suppliers/supplier-show/supplier-show.component').then(c => c.SupplierShowComponent),
    canActivate: [AuthGuard]
  },
  //ruta para entrada
  {
    path: 'entries',
    loadChildren: () => import('./features/entries/entry.routes').then(c => c.ENTRIES_ROUTES),
    canActivate: [AuthGuard]
  },
    {
    path: 'entries-edit/:id',
    loadComponent: () => import('./features/entries/entry-edit/entry-edit.component').then(c => c.EntryEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'entries-create',
    loadComponent: () => import('./features/entries/entry-create/entry-create.component').then(c => c.EntryCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'entries-list',
    loadComponent: () => import('./features/entries/entry-list/entry-list.component').then(c => c.EntryListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'entries-show/:id',
    loadComponent: () => import('./features/entries/entry-show/entry-show.component').then(c => c.EntryShowComponent),
    canActivate: [AuthGuard]
  },
  //ruta para salidas
  {
    path: 'operations',
    loadChildren: () => import('./features/operations/operation.routes').then(c => c.OPERATION_ROUTES),
    canActivate: [AuthGuard]
  },
    {
    path: 'operations-edit/:id',
    loadComponent: () => import('./features/operations/operation-edit/operation-edit.component').then(c => c.OperationEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'operations-create',
    loadComponent: () => import('./features/operations/operation-create/operation-create.component').then(c => c.OperationCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'operations-list',
    loadComponent: () => import('./features/operations/operation-list/operation-list.component').then(c => c.OperationListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'operations-show/:id',
    loadComponent: () => import('./features/operations/operation-show/operation-show.component').then(c => c.OperationShowComponent),
    canActivate: [AuthGuard]
  },
   //ruta para eperaciones
  {
    path: 'outs',
    loadChildren: () => import('./features/outs/out.routes').then(c => c.OUT_ROUTES),
    canActivate: [AuthGuard]
  },
    {
    path: 'outs-edit/:id',
    loadComponent: () => import('./features/outs/out-edit/out-edit.component').then(c => c.OutEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'outs-create',
    loadComponent: () => import('./features/outs/out-create/out-create.component').then(c => c.OutCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'outs-list',
    loadComponent: () => import('./features/outs/out-list/out-list.component').then(c => c.OutListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'outs-show/:id',
    loadComponent: () => import('./features/outs/out-show/out-show.component').then(c => c.OutShowComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'txs',
    loadChildren: () => import('./features/txs/tx.routes').then(c => c.TX_ROUTES),
    canActivate: [AuthGuard]
  },
   {
    path: 'txs-edit/:id',
    loadComponent: () => import('./features/txs/tx-edit/tx-edit.component').then(c => c.TxEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'txs-create',
    loadComponent: () => import('./features/txs/tx-create/tx-create.component').then(c => c.TxCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'txs-list',
    loadComponent: () => import('./features/txs/tx-list/tx-list.component').then(c => c.TxListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'txs-show/:id',
    loadComponent: () => import('./features/txs/tx-show/tx-show.component').then(c => c.TxShowComponent),
    canActivate: [AuthGuard]
  },
     {
    path: 'orders',
    loadChildren: () => import('./features/orders/order.routes').then(c => c.ORDER_ROUTES),
    canActivate: [AuthGuard]
  },
   {
    path: 'orders-edit/:id',
    loadComponent: () => import('./features/orders/order-edit/order-edit.component').then(c => c.OrderEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders-create',
    loadComponent: () => import('./features/orders/order-create/order-create.component').then(c => c.OrderCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'orders-list',
    loadComponent: () => import('./features/orders/order-list/order-list.component').then(c => c.OrderListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders-show/:id',
    loadComponent: () => import('./features/orders/order-show/order-show.component').then(c => c.OrderShowComponent),
    canActivate: [AuthGuard]
  },
      {
    path: 'clients-management',
    loadChildren: () => import('./features/clients-management/clients-management.routes').then(c => c.CLIENTS_MANAGEMENT_ROUTES),
    canActivate: [AuthGuard]
  },
   {
    path: 'clients-management-edit/:id',
    loadComponent: () => import('./features/clients-management/client-edit/client-edit.component').then(c => c.ClientEditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-management-create',
    loadComponent: () => import('./features/clients-management/client-create/client-create.component').then(c => c.ClientCreateComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'clients-management-list',
    loadComponent: () => import('./features/clients-management/client-list/client-list.component').then(c => c.ClientListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients-management-show/:id',
    loadComponent: () => import('./features/clients-management/client-show/client-show.component').then(c => c.ClientShowComponent),
    canActivate: [AuthGuard]
  },
 
   {
    path: '**',
    loadComponent: () => import('./layout/page-not-fo/page-not-fo.component').then(c => c.PageNotFoComponent)
  },
];
