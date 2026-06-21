import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { OrderItem } from '../domain/model/order-item.entity';
import { Order } from '../domain/model/order.entity';
import { PurchaseOrderItemResource, PurchaseOrderResource, PurchaseOrderResponse } from './purchase-order-response';

export class PurchaseOrderAssembler implements BaseAssembler<
  Order,
  PurchaseOrderResource,
  PurchaseOrderResponse
> {
  toEntityFromResource(resource: PurchaseOrderResource): Order {
    return new Order({
      id: resource.id ?? null,
      code: resource.code ?? '',
      supplierId: resource.supplierId ?? null,
      supplierName: resource.supplierName ?? '',
      restaurantName: resource.restaurantName ?? '',
      orderDate: resource.orderDate ?? '',
      estimatedDate: resource.estimatedDate ?? '',
      priority: resource.priority ?? '',
      status: resource.status ?? '',
      items: Array.isArray(resource.items)
        ? resource.items.map((item) => new OrderItem({
            id: item.id ?? null,
            inventoryItemId: item.inventoryItemId ?? null,
            productName: item.productName,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            unitType: item.unitType
          }))
        : []
    });
  }

  toResourceFromEntity(entity: Order): PurchaseOrderResource {
    return {
      id: entity.id,
      code: entity.code,
      supplierId: entity.supplierId,
      supplierName: entity.supplierName,
      restaurantName: entity.restaurantName,
      orderDate: entity.orderDate,
      estimatedDate: entity.estimatedDate,
      priority: entity.priority,
      status: entity.status,
      items: entity.items.map((item) => this.toItemResource(item))
    };
  }

  toEntitiesFromResponse(response: PurchaseOrderResponse): Order[] {
    const resources = response.purchaseOrders ?? response['purchase-orders'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  private toItemResource(item: OrderItem): PurchaseOrderItemResource {
    return {
      id: item.id,
      inventoryItemId: item.inventoryItemId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      unitType: item.unitType
    };
  }
}
