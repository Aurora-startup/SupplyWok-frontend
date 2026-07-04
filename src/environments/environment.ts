export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8095/api/v1',
  authenticationEndpointPath: '/authentication',
  authenticationSignInEndpointPath: '/sign-in',
  authenticationSignUpEndpointPath: '/sign-up',
  platformApiBaseUrl: 'http://localhost:8095/api/v1',
  purchaseOrdersEndpointPath: '/purchase-orders',
  platformProviderSuppliersEndpointPath: '/suppliers',
  tablesEndpointPath: '/tables',
  comandasEndpointPath: '/comandas',

  platformProviderApiBaseUrl: 'http://localhost:8095/api/v1',
  platformProviderInventoryItemsEndpointPath: '/supplies',
  platformProviderCategoriesEndpointPath: '/supplies',
  platformProviderUnitsOfMeasureEndpointPath: '/unitsOfMeasure',

  platformIotApiBaseURL: 'http://localhost:8095/api/v1',
  platformProviderUsersEndpointPath: '/authentication',
  platformProviderSensorsEndpointPath: '/sensors',

  //supplier apis endpoints
  supplierCrudApiBaseUrl: 'http://localhost:8095/api/v1',
  supplierGetApiBaseUrl: 'http://localhost:8095/api/v1',
  supplierAlertsEndpointPath: '/supplier/alerts',
  supplierClientsEndpointPath: '/clients',
  suppliersEndpointPath: '/suppliers',
  catalogItemsEndpointPath: '/catalog-items',
  demandForecastsEndpointPath: '/demand-forecasts',
  deliveryRoutesEndpointPath: '/delivery-routes',
  supplierSettingsEndpointPath: '/supplier-settings',
  supplierSubscriptionsEndpointPath: '/supplier-subscriptions',
  //end supplier apis endpoints
};
