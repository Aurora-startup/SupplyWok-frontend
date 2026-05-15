import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { ClientForecast, ForecastPoint } from '../domain/model/demand-forecast.entity';
import { DeliveryRouteStop } from '../domain/model/delivery-route.entity';
import { SupplierContact, SupplierNotifications } from '../domain/model/supplier-settings.entity';
import { SubscriptionSummaryItem, SupplierSubscriptionPlan } from '../domain/model/supplier-subscription.entity';

export interface SupplierOrderItemResource extends BaseResource {
  inventoryItemId?: number | string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
}

export interface OrderResource extends BaseResource {
  code?: string;
  supplierId?: number | string | null;
  supplierName?: string;
  restaurantName?: string;
  orderDate?: string | null;
  estimatedDate?: string | null;
  priority?: string;
  status?: string;
  items?: SupplierOrderItemResource[];
}

export interface OrdersResponse extends BaseResponse {
  purchaseOrders?: OrderResource[];
  'purchase-orders'?: OrderResource[];
}

export interface CatalogItemResource extends BaseResource {
  name?: string;
  category?: string;
  price?: number;
  unit?: string;
  deliveryConditions?: string;
}

export interface CatalogItemsResponse extends BaseResponse {
  catalogItems?: CatalogItemResource[];
  'catalog-items'?: CatalogItemResource[];
}

export interface ClientResource extends BaseResource {
  name?: string;
  district?: string;
  frequency?: string;
  averageTicket?: number;
  demandProjectionPercent?: number;
  status?: string;
  lastOrderDate?: string;
}

export interface ClientsResponse extends BaseResponse {
  clients?: ClientResource[];
}

export interface DeliveryRouteResource extends BaseResource {
  date?: string;
  routeName?: string;
  supplierName?: string;
  vehicle?: string;
  status?: string;
  totalStops?: number;
  totalOrders?: number;
  estimatedDeparture?: string;
  estimatedArrival?: string;
  estimatedDurationMinutes?: number;
  stops?: DeliveryRouteStop[];
}

export interface DeliveryRoutesResponse extends BaseResponse {
  deliveryRoutes?: DeliveryRouteResource[];
  'delivery-routes'?: DeliveryRouteResource[];
}

export interface DemandForecastResource extends BaseResource {
  aggregate?: ForecastPoint[];
  clients?: ClientForecast[];
}

export interface DemandForecastsResponse extends BaseResponse {
  demandForecasts?: DemandForecastResource[];
  'demand-forecasts'?: DemandForecastResource[];
}

export interface SupplierAlertResource extends BaseResource {
  severity?: string;
  detail?: string;
  date?: string;
  status?: string;
}

export interface SupplierAlertsResponse extends BaseResponse {
  alerts?: SupplierAlertResource[];
  supplierAlerts?: SupplierAlertResource[];
  'supplier-alerts'?: SupplierAlertResource[];
}

export interface SupplierSettingsResource extends BaseResource {
  supplierName?: string;
  supportContact?: string;
  notifications?: SupplierNotifications;
  serviceZones?: string[];
  contacts?: SupplierContact[];
}

export interface SupplierSettingsResponse extends BaseResponse {
  supplierSettings?: SupplierSettingsResource;
  supplierSettingsList?: SupplierSettingsResource[];
  'supplier-settings'?: SupplierSettingsResource[];
}

export interface SupplierSubscriptionResource extends BaseResource {
  currentPlan?: string;
  summary?: SubscriptionSummaryItem[];
  plans?: SupplierSubscriptionPlan[];
}

export interface SupplierSubscriptionsResponse extends BaseResponse {
  supplierSubscription?: SupplierSubscriptionResource;
  supplierSubscriptions?: SupplierSubscriptionResource[];
  'supplier-subscriptions'?: SupplierSubscriptionResource[];
}
