import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { InventoryManagementApi } from '../../../../inventory-management/infrastructure/inventory-management-api';
import { InventoryItem } from '../../../../inventory-management/domain/model/inventory-item.entity';
import { InventoryStatus } from '../../../../inventory-management/domain/enums/inventory-status.enum';
import { UnitOfMeasure } from '../../../../inventory-management/domain/enums/unit-of-measure.enum';
import { IotMonitoringApi } from '../../../infrastructure/iot-monitoring-api';
import { Alert } from '../../../domain/model/alert.entity';
import { Sensor } from '../../../domain/model/sensor.entity';
import { PurchaseOrderApi } from '../../../../supply-and-purchasing/infrastructure/purchase-order-api';
import { PurchaseOrder } from '../../../../supply-and-purchasing/domain/model/purchase-order.entity';
import { ComandaApi } from '../../../../restaurant-management/infrastructure/comanda-api';
import { TableApi } from '../../../../restaurant-management/infrastructure/table-api';
import { Comanda } from '../../../../restaurant-management/domain/model/comanda.entity';
import { COMANDA_STATUS_ORDER, ComandaStatus } from '../../../../restaurant-management/domain/enums/comanda-status.enum';
import { Table } from '../../../../restaurant-management/domain/model/table.entity';
import { TableStatus } from '../../../../restaurant-management/domain/enums/table-status.enum';

type DashboardTone = 'healthy' | 'warning' | 'critical' | 'muted';

@Component({
  selector: 'app-iot-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iot-dashboard.component.html',
  styleUrl: './iot-dashboard.component.css'
})
export class IotDashboardComponent implements OnInit {
  private readonly inventoryApi = inject(InventoryManagementApi);
  private readonly monitoringApi = inject(IotMonitoringApi);
  private readonly purchaseApi = inject(PurchaseOrderApi);
  private readonly comandaApi = inject(ComandaApi);
  private readonly tableApi = inject(TableApi);
  private readonly cdr = inject(ChangeDetectorRef);

  protected highlightedSensors: Sensor[] = [];
  protected recentAlerts: Alert[] = [];
  protected highlightedInventory: InventoryItem[] = [];
  protected highlightedOrders: PurchaseOrder[] = [];
  protected highlightedComandas: Comanda[] = [];

  protected inventoryHealth = 0;
  protected activeAlertsCount = 0;
  protected occupiedTableRate = 0;
  protected pendingOrdersCount = 0;
  protected activeKitchenTicketsCount = 0;

  private inventoryItems: InventoryItem[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private comandas: Comanda[] = [];
  private tables: Table[] = [];

  ngOnInit(): void {
    this.monitoringApi.getSensors().subscribe({
      next: (sensors) => {
        this.hydrateSensors(sensors);
        this.cdr.detectChanges();
      }
    });

    this.inventoryApi.getInventoryItems().subscribe({
      next: (inventoryItems) => {
        this.inventoryItems = inventoryItems;
        this.hydrateInventory();
        this.cdr.detectChanges();
      }
    });

    this.purchaseApi.getPurchaseOrders().subscribe({
      next: (purchaseOrders) => {
        this.purchaseOrders = purchaseOrders;
        this.hydrateOrders();
        this.cdr.detectChanges();
      }
    });

    this.comandaApi.getComandas().subscribe({
      next: (comandas) => {
        this.comandas = comandas;
        this.hydrateComandas();
        this.cdr.detectChanges();
      }
    });

    this.tableApi.getTables().subscribe({
      next: (tables) => {
        this.tables = tables;
        this.hydrateTables();
        this.cdr.detectChanges();
      }
    });

    window.setTimeout(() => this.seedFallbacksIfNeeded(), 1600);
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
      return 'Disconnected';
    }

    const isOutOfRange = sensor.lastValue < sensor.minValue || sensor.lastValue > sensor.maxValue;
    return isOutOfRange ? 'Out of range' : 'Stable';
  }

  protected getKitchenStatusTone(comanda: Comanda): DashboardTone {
    if (comanda.status === ComandaStatus.LISTO) return 'healthy';
    if (comanda.status === ComandaStatus.EN_PREPARACION) return 'warning';
    if (comanda.status === ComandaStatus.EN_COLA) return 'muted';
    return 'critical';
  }

  protected getKitchenStatusKey(comanda: Comanda): string {
    const labels: Record<ComandaStatus, string> = {
      [ComandaStatus.EN_COLA]: 'Pending',
      [ComandaStatus.EN_PREPARACION]: 'In Preparation',
      [ComandaStatus.LISTO]: 'Ready',
      [ComandaStatus.ENTREGADO]: 'Delivered'
    };

    return labels[comanda.status] ?? 'Unknown';
  }

  protected getKitchenCode(comanda: Comanda): string {
    return `C${String(comanda.id ?? '').padStart(3, '0')}`;
  }

  protected getKitchenItemCount(comanda: Comanda): number {
    return comanda.items.reduce((count, item) => count + item.quantity, 0);
  }

  protected getKitchenActionKey(comanda: Comanda): string | null {
    const nextStatus = this.getNextStatus(comanda.status);

    if (nextStatus === ComandaStatus.EN_PREPARACION) return 'Start Preparation';
    if (nextStatus === ComandaStatus.LISTO) return 'Mark as Ready';
    if (nextStatus === ComandaStatus.ENTREGADO) return 'Mark as Delivered';

    return null;
  }

  protected advanceComanda(comanda: Comanda): void {
    const nextStatus = this.getNextStatus(comanda.status);
    if (!nextStatus) {
      return;
    }

    const updated = new Comanda({
      id: comanda.id,
      tableId: comanda.tableId,
      tableNumber: comanda.tableNumber,
      items: comanda.items,
      status: nextStatus,
      createdAt: comanda.createdAt,
      updatedAt: new Date().toISOString()
    });

    this.comandaApi.updateComanda(updated).subscribe({
      next: (savedComanda) => {
        this.comandas = this.comandas.map((item) => item.id === savedComanda.id ? savedComanda : item);
        this.hydrateComandas();
        this.cdr.detectChanges();
      }
    });
  }

  protected getOrderStatusTone(order: PurchaseOrder): DashboardTone {
    if (order.status === 'Delivered') return 'healthy';
    if (order.status === 'In Preparation') return 'warning';
    if (order.status === 'Pending') return 'critical';
    return 'muted';
  }

  protected getOrderStatusLabel(order: PurchaseOrder): string {
    return order.status;
  }

  protected formatOrderCode(order: PurchaseOrder): string {
    return order.code ? `#${order.code}` : `#PO-${String(order.id ?? '').padStart(4, '0')}`;
  }

  protected getInventoryStatusTone(item: InventoryItem): DashboardTone {
    if (item.status === InventoryStatus.REFILL_NEEDED) return 'critical';
    if (item.status === InventoryStatus.LOW_STOCK) return 'warning';
    return 'healthy';
  }

  protected getInventoryStatusKey(item: InventoryItem): string {
    if (item.status === InventoryStatus.REFILL_NEEDED) return 'Critical';
    if (item.status === InventoryStatus.LOW_STOCK) return 'Low';
    return 'Healthy';
  }

  protected getUnitLabel(item: InventoryItem): string {
    if (item.unitOfMeasure === UnitOfMeasure.KG) return 'KILOGRAMS';
    if (item.unitOfMeasure === UnitOfMeasure.LTS) return 'LITERS';
    if (item.unitOfMeasure === UnitOfMeasure.UNITS) return 'UNITS';
    return 'GRAMS';
  }

  protected getSensorDisplayName(sensor: Sensor): string {
    return sensor.name.replace(/[_-]/g, ' ').toUpperCase();
  }

  protected formatAlertTitle(alert: Alert): string {
    const titleMap: Record<string, string> = {
      'iot.alerts.cold-storage-breach-title': 'Cold storage warning',
      'iot.alerts.kitchen-temp-breach-title': 'Kitchen temperature warning',
      'iot.alerts.low-stock-title': 'Low stock warning',
      'iot.alerts.high-occupancy-title': 'High occupancy table'
    };

    return titleMap[alert.titleKey] ?? 'Operational alert';
  }

  protected formatAlertMessage(alert: Alert): string {
    const sensorName = String(alert.messageParams['sensorName'] ?? 'Sensor').toLowerCase();
    const lastValue = alert.messageParams['lastValue'];
    const minValue = alert.messageParams['minValue'];
    const maxValue = alert.messageParams['maxValue'];

    if (alert.messageKey === 'iot.alerts.temp-exceeded-msg') {
      return `${sensorName} reached ${lastValue} (max ${maxValue}). Immediate review required.`;
    }

    if (alert.messageKey === 'iot.alerts.temp-dropped-msg') {
      return `${sensorName} dropped to ${lastValue} (min ${minValue}). Immediate review required.`;
    }

    if (alert.messageKey === 'iot.alerts.low-stock-msg') {
      return `${sensorName} has fallen to ${lastValue} units (minimum ${minValue}). Restock required.`;
    }

    if (alert.messageKey === 'iot.alerts.high-occupancy-msg') {
      return `${sensorName} is close to maximum occupancy (${lastValue}).`;
    }

    return 'Check the operational panel for more context.';
  }

  private hydrateSensors(sensors: Sensor[]): void {
    this.highlightedSensors = sensors.slice(0, 3);

    const alerts = sensors
      .map((sensor) => Alert.fromSensor(sensor))
      .filter((alert): alert is Alert => alert !== null)
      .sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime());

    this.recentAlerts = alerts.slice(0, 3);
    this.activeAlertsCount = alerts.length;
  }

  private hydrateInventory(): void {
    this.highlightedInventory = [...this.inventoryItems]
      .filter((item) => item.currentStock <= item.minimumStockLevel)
      .sort((left, right) => this.getStockGap(left) - this.getStockGap(right))
      .slice(0, 4);

    this.inventoryHealth = this.inventoryItems.length
      ? Math.round((this.inventoryItems.filter((item) => item.currentStock > item.minimumStockLevel * 1.5).length / this.inventoryItems.length) * 100)
      : 0;
  }

  private hydrateOrders(): void {
    this.highlightedOrders = [...this.purchaseOrders]
      .sort((left, right) => this.toTimestamp(right.orderDate) - this.toTimestamp(left.orderDate))
      .slice(0, 3);

    this.pendingOrdersCount = this.purchaseOrders.filter((order) => order.status === 'Pending').length;
  }

  private hydrateTables(): void {
    this.occupiedTableRate = this.tables.length
      ? Math.round((this.tables.filter((table) => table.status === TableStatus.OCCUPIED).length / this.tables.length) * 100)
      : 0;
  }

  private hydrateComandas(): void {
    const activeComandas = [...this.comandas]
      .filter((comanda) => comanda.status !== ComandaStatus.ENTREGADO)
      .sort((left, right) => this.toTimestamp(right.createdAt) - this.toTimestamp(left.createdAt));

    this.highlightedComandas = activeComandas.slice(0, 3);
    this.activeKitchenTicketsCount = activeComandas.length;
  }

  private getNextStatus(current: ComandaStatus): ComandaStatus | null {
    const index = COMANDA_STATUS_ORDER.indexOf(current);
    return index < COMANDA_STATUS_ORDER.length - 1 ? COMANDA_STATUS_ORDER[index + 1] : null;
  }

  private seedFallbacksIfNeeded(): void {
    if (!this.highlightedSensors.length) {
      this.highlightedSensors = [
        new Sensor({ id: 1, name: 'Kitchen', minValue: 20, maxValue: 26, enabled: true, lastValue: 108.5, type: 'kitchen-temperature' }),
        new Sensor({ id: 2, name: 'Cold Storage', minValue: 2, maxValue: 8, enabled: true, lastValue: -1.2, type: 'storage-temperature' }),
        new Sensor({ id: 3, name: 'Dining Room', minValue: 0, maxValue: 100, enabled: true, lastValue: 70, type: 'table-pressure' })
      ];
    }

    if (!this.recentAlerts.length) {
      this.recentAlerts = [
        new Alert({
          id: 1,
          sensorId: 1,
          titleKey: 'iot.alerts.low-stock-title',
          messageKey: 'iot.alerts.low-stock-msg',
          messageParams: { sensorName: 'cleaning supplies', lastValue: 2, minValue: 5 },
          severity: 'High',
          status: 'Open',
          source: 'Inventory',
          timestamp: new Date('2026-05-13T18:03:00Z')
        }),
        new Alert({
          id: 2,
          sensorId: 2,
          titleKey: 'iot.alerts.low-stock-title',
          messageKey: 'iot.alerts.low-stock-msg',
          messageParams: { sensorName: 'beverage crates', lastValue: -5, minValue: 0 },
          severity: 'High',
          status: 'Open',
          source: 'Inventory',
          timestamp: new Date('2026-05-13T18:03:00Z')
        }),
        new Alert({
          id: 3,
          sensorId: 3,
          titleKey: 'iot.alerts.high-occupancy-title',
          messageKey: 'iot.alerts.high-occupancy-msg',
          messageParams: { sensorName: 'table 7', lastValue: 95 },
          severity: 'Medium',
          status: 'Open',
          source: 'Dining Area',
          timestamp: new Date('2026-05-13T18:03:00Z')
        })
      ];
      this.activeAlertsCount = this.recentAlerts.length;
    }

    if (!this.highlightedComandas.length) {
      this.comandas = [
        new Comanda({
          id: 1,
          tableId: 2,
          tableNumber: 2,
          status: ComandaStatus.EN_PREPARACION,
          createdAt: '2026-05-13T13:09:00Z',
          updatedAt: '2026-05-13T13:09:00Z',
          items: [
            { id: 1, dishName: 'Arroz Chaufa', quantity: 2 },
            { id: 2, dishName: 'Inca Kola', quantity: 3 }
          ]
        }),
        new Comanda({
          id: 2,
          tableId: 0,
          tableNumber: 0,
          status: ComandaStatus.LISTO,
          createdAt: '2026-05-13T13:15:00Z',
          updatedAt: '2026-05-13T13:15:00Z',
          items: [
            { id: 1, dishName: 'Lomo Saltado', quantity: 1 },
            { id: 2, dishName: 'Coca Cola', quantity: 2 }
          ]
        })
      ];
      this.hydrateComandas();
    }

    if (!this.highlightedOrders.length) {
      this.purchaseOrders = [
        new PurchaseOrder({
          id: 24521,
          code: 'PO-24521',
          supplierId: 201,
          supplierName: 'Golden Wok Produce',
          restaurantName: 'Gran Dragon Chifa',
          orderDate: '2026-05-13',
          estimatedDate: '2026-05-15',
          priority: 'Medium',
          status: 'Pending',
          items: []
        }),
        new PurchaseOrder({
          id: 30343,
          code: 'PO-30343',
          supplierId: 201,
          supplierName: 'Golden Wok Produce',
          restaurantName: 'Gran Dragon Chifa',
          orderDate: '2026-05-13',
          estimatedDate: '2026-05-15',
          priority: 'Medium',
          status: 'Pending',
          items: []
        }),
        new PurchaseOrder({
          id: 24021,
          code: 'PO-24021',
          supplierId: 201,
          supplierName: 'Golden Wok Produce',
          restaurantName: 'Gran Dragon Chifa',
          orderDate: '2026-05-09',
          estimatedDate: '2026-05-11',
          priority: 'High',
          status: 'Pending',
          items: []
        })
      ];
      this.hydrateOrders();
    }

    if (!this.highlightedInventory.length) {
      this.inventoryItems = [
        new InventoryItem({ id: 1, name: 'Agua', currentStock: 50, minimumStockLevel: 60, unitOfMeasure: UnitOfMeasure.LTS, idCategory: 1, idSupplier: 1 }),
        new InventoryItem({ id: 2, name: 'Carne', currentStock: 50, minimumStockLevel: 60, unitOfMeasure: UnitOfMeasure.UNITS, idCategory: 1, idSupplier: 1 })
      ];
      this.hydrateInventory();
    }

    if (this.occupiedTableRate === 0) {
      this.occupiedTableRate = 70;
    }

    this.cdr.detectChanges();
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
