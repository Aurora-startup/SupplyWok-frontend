export const environment = {
  production: false,

  supplyWokPlatformBaseUrl: 'http://localhost:8095/api/v1',
  authenticationEndpointPath: '/authentication',
  authenticationSignInEndpointPath: '/sign-in',
  authenticationSignUpEndpointPath: '/sign-up',
  purchaseOrdersEndpointPath: '/purchase-orders',
  platformProviderSuppliersEndpointPath: '/suppliers',
  tablesEndpointPath: '/tables',
  comandasEndpointPath: '/comandas',

  platformProviderInventoryItemsEndpointPath: '/supplies',
  platformProviderCategoriesEndpointPath: '/supplies',
  platformProviderUnitsOfMeasureEndpointPath: '/unitsOfMeasure',

  platformProviderUsersEndpointPath: '/authentication',
  platformProviderSensorsEndpointPath: '/sensors',

  supplierAlertsEndpointPath: '/supplier/alerts',
  restaurantAlertsEndpointPath: '/restaurant/alerts',
  supplierClientsEndpointPath: '/clients',
  suppliersEndpointPath: '/suppliers',
  catalogItemsEndpointPath: '/catalog-items',
  demandForecastsEndpointPath: '/demand-forecasts',
  // end supplier apis endpoints
};
