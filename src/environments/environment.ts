export const environment = {
  production: true,

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

  platformProviderUsersEndpointPath: '/users',
  platformProviderSensorsEndpointPath: '/sensors',

  supplierAlertsEndpointPath: '/supplier/alerts',
  restaurantAlertsEndpointPath: '/restaurant/alerts',
  supplierClientsEndpointPath: '/clients',
  suppliersEndpointPath: '/suppliers',
  supplierPortalSupplierId: 1,
  catalogItemsEndpointPath: '/catalog-items',
  demandForecastsEndpointPath: '/demand-forecasts',
  supplierSettingsEndpointPath: '/supplier-settings',
  supplierSubscriptionsEndpointPath: '/supplier-subscriptions',
  //end supplier apis endpoints
};
