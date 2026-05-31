import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryManagementStore } from '../../../../inventory-management/application/inventory-management-store';
import { InventoryItem } from '../../../../inventory-management/domain/model/inventory-item.entity';
import { IotStore } from '../../../application/iot-store';
import { Sensor } from '../../../domain/model/sensor.entity';
import { PurchaseOrderStore } from '../../../../supply-and-purchasing/application/purchase-order.store';
import { PurchaseOrder } from '../../../../supply-and-purchasing/domain/model/purchase-order.entity';
import { RestaurantManagementStore } from '../../../../restaurant-management/application/restaurant-management.store';
import { Comanda } from '../../../../restaurant-management/domain/model/comanda.entity';
import { ComandaStatus } from '../../../../restaurant-management/domain/enums/comanda-status.enum';

type DashboardTone = 'healthy' | 'warning' | 'critical' | 'muted';

@Component({
  selector: 'app-iot-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './iot-dashboard.component.html',
  styleUrl: './iot-dashboard.component.css'
})
export class IotDashboardComponent implements OnInit {
  protected readonly inventoryStore = inject(InventoryManagementStore);
  protected readonly monitoringStore = inject(IotStore);
  protected readonly purchaseStore = inject(PurchaseOrderStore);
  protected readonly restaurantStore = inject(RestaurantManagementStore);

  protected readonly highlightedSensors = computed(() => this.monitoringStore.sensors().slice(0, 4));

  protected readonly highlightedInventory = computed(() =>
    [...this.inventoryStore.inventoryItems()]
      .filter((item) => item.currentStock <= item.minimumStockLevel * 1.5)
      .sort((left, right) => this.getStockGap(left) - this.getStockGap(right))
      .slice(0, 5)
  );

  protected readonly highlightedOrders = computed(() =>
    [...this.purchaseStore.purchaseOrders()]
      .sort((left, right) => this.toTimestamp(right.orderDate) - this.toTimestamp(left.orderDate))
      .slice(0, 4)
  );

  protected readonly highlightedComandas = computed(() =>
    [...this.restaurantStore.comandas()]
      .filter((comanda) => comanda.status !== ComandaStatus.ENTREGADO)
      .sort((left, right) => this.toTimestamp(right.createdAt) - this.toTimestamp(left.createdAt))
      .slice(0, 4)
  );

  protected readonly inventoryHealth = computed(() => {
    const items = this.inventoryStore.inventoryItems();
    if (!items.length) {
      return 0;
    }

    const healthyItems = items.filter((item) => item.currentStock > item.minimumStockLevel * 1.5).length;
    return Math.round((healthyItems / items.length) * 100);
  });

  ngOnInit(): void {
    this.monitoringStore.loadSensors();
    this.purchaseStore.ensurePurchaseOrdersLoaded();
    this.restaurantStore.loadComandas();
    this.restaurantStore.loadTables();
  }

  protected getOccupiedTablesCount(): number {
    return this.restaurantStore.occupiedCount();
  }

  protected formatDate(value: string): string {
    if (!value) {
      return '--';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('es-PE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(parsedDate);
  }

  protected getSensorTone(sensor: Sensor): DashboardTone {
    if (!sensor.enabled) {
      return 'muted';
    }

    const isOutOfRange = sensor.lastValue < sensor.minValue || sensor.lastValue > sensor.maxValue;
    return isOutOfRange ? 'critical' : 'healthy';
  }

  protected getSensorStatusKey(sensor: Sensor): string {
    if (!sensor.enabled) {
      return 'restaurantManagement.dashboardPage.sensor.status.disconnected';
    }

    const isOutOfRange = sensor.lastValue < sensor.minValue || sensor.lastValue > sensor.maxValue;
    return isOutOfRange
      ? 'restaurantManagement.dashboardPage.sensor.status.outOfRange'
      : 'restaurantManagement.dashboardPage.sensor.status.stable';
  }

  protected getKitchenStatusTone(comanda: Comanda): DashboardTone {
    if (comanda.status === ComandaStatus.LISTO) return 'healthy';
    if (comanda.status === ComandaStatus.EN_PREPARACION) return 'warning';
    if (comanda.status === ComandaStatus.EN_COLA) return 'muted';
    return 'critical';
  }

  protected getKitchenStatusKey(comanda: Comanda): string {
    return `restaurant-management.kitchen.status.${comanda.status}`;
  }

  protected getOrderStatusTone(order: PurchaseOrder): DashboardTone {
    if (order.status === 'Delivered') return 'healthy';
    if (order.status === 'In Preparation') return 'warning';
    if (order.status === 'Pending') return 'critical';
    return 'muted';
  }

  protected getOrderStatusLabel(order: PurchaseOrder): string {
    const statusMap: Record<string, string> = {
      Pending: 'supply-and-purchasing.shared.status.pending',
      'In Preparation': 'supply-and-purchasing.shared.status.in-preparation',
      Delivered: 'supply-and-purchasing.shared.status.delivered',
      Delayed: 'supply-and-purchasing.shared.status.delayed'
    };

    return statusMap[order.status] ?? order.status;
  }

  protected formatOrderCode(order: PurchaseOrder): string {
    return `#PO-${String(order.id ?? '').padStart(4, '0')}`;
  }

  protected getStockLevelPercentage(item: InventoryItem): number {
    if (item.minimumStockLevel <= 0) {
      return 100;
    }

    const percentage = Math.round((item.currentStock / item.minimumStockLevel) * 100);
    return Math.max(8, Math.min(100, percentage));
  }

  private getStockGap(item: InventoryItem): number {
    return item.currentStock - item.minimumStockLevel;
  }

  private toTimestamp(value: string): number {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  }
}
