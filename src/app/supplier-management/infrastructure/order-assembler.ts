import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Order, SupplierOrderItem } from '../domain/model/order.entity';
import { OrderResource, OrdersResponse, SupplierOrderItemResource } from './orders-response';

export class OrderAssembler implements BaseAssembler<Order, OrderResource, OrdersResponse> {
  toEntityFromResource(resource: OrderResource): Order {
    return new Order({
      id: resource.id ?? null,
      code: resource.code ?? '',
      supplierId: resource.supplierId ?? null,
      supplierName: resource.supplierName ?? '',
      restaurantName: resource.restaurantName ?? '',
      orderDate: resource.orderDate ?? null,
      estimatedDate: resource.estimatedDate ?? null,
      priority: resource.priority ?? '',
      status: resource.status ?? '',
      items: (resource.items ?? []).map((item) => this.toItemEntity(item))
    });
  }

  toResourceFromEntity(entity: Order): OrderResource {
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

  toEntitiesFromResponse(response: OrdersResponse): Order[] {
    const resources = response.purchaseOrders ?? response['purchase-orders'] ?? [];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  private toItemEntity(item: SupplierOrderItemResource): SupplierOrderItem {
    return {
      id: item.id ?? null,
      inventoryItemId: item.inventoryItemId ?? null,
      productName: item.productName,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      unitType: item.unitType
    };
  }

  private toItemResource(item: SupplierOrderItem): SupplierOrderItemResource {
    return { ...item };
  }
}
