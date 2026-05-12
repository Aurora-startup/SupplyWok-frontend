import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { OrderItem } from '../domain/model/order-item.entity';
import { PurchaseOrder } from '../domain/model/purchase-order.entity';
import { PurchaseOrderItemResource, PurchaseOrderResource, PurchaseOrderResponse } from './purchase-order-response';

export class PurchaseOrderAssembler extends BaseAssembler<
  PurchaseOrder,
  PurchaseOrderResource,
  PurchaseOrderResponse
> {
  toEntityFromResource(resource: PurchaseOrderResource): PurchaseOrder {
    return new PurchaseOrder({
      id: resource.id ?? null,
      supplierId: resource.supplierId,
      supplierName: resource.supplierName,
      orderDate: resource.orderDate,
      priority: resource.priority,
      status: resource.status,
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

  toResourceFromEntity(entity: PurchaseOrder): PurchaseOrderResource {
    return {
      id: entity.id,
      supplierId: entity.supplierId,
      supplierName: entity.supplierName,
      orderDate: entity.orderDate,
      priority: entity.priority,
      status: entity.status,
      items: entity.items.map((item) => this.toItemResource(item))
    };
  }

  toEntitiesFromResponse(response: PurchaseOrderResponse): PurchaseOrder[] {
    const resources = Array.isArray(response.purchaseOrders) ? response.purchaseOrders : [];
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
