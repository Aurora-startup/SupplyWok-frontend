import { BaseEntity } from "../../../shared/infrastructure/base-entity";
import { InventoryStatus } from '../enums/inventory-status.enum';
import { InventoryCategory } from './inventory-category.entity';
import { Supplier } from './supplier.entity';
import { UnitOfMeasure } from '../enums/unit-of-measure.enum';

export class InventoryItem implements BaseEntity {
  private _id: number;
  private _name: string;
  private _currentStock: number;
  private _minimumStockLevel: number;
  private _unitOfMeasure: UnitOfMeasure | null;
  private _idCategory: number;
  private _category: InventoryCategory | null;
  private _idSupplier: number;
  private _supplier: Supplier | null;

  constructor(inventoryItem: {
    id: number;
    name: string;
    currentStock: number;
    minimumStockLevel: number;
    unitOfMeasure: UnitOfMeasure | null;
    idCategory: number;
    idSupplier: number;
    category?: InventoryCategory | null;
    supplier?: Supplier | null;
  }) {
    this._id = inventoryItem.id;
    this._name = inventoryItem.name;
    this._currentStock = inventoryItem.currentStock;
    this._minimumStockLevel = inventoryItem.minimumStockLevel;
    this._unitOfMeasure = inventoryItem.unitOfMeasure;
    this._idCategory = inventoryItem.idCategory;
    this._idSupplier = inventoryItem.idSupplier;
    this._category = inventoryItem.category ?? null;
    this._supplier = inventoryItem.supplier ?? null;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get currentStock(): number {
    return this._currentStock;
  }
  set currentStock(value: number) {
    this._currentStock = value;
  }
  get minimumStockLevel(): number {
    return this._minimumStockLevel;
  }
  set minimumStockLevel(value: number) {
    this._minimumStockLevel = value;
  }
  get unitOfMeasure(): UnitOfMeasure | null {
    return this._unitOfMeasure;
  }

  set unitOfMeasure(value: UnitOfMeasure) {
    this._unitOfMeasure = value;
  }

  get idCategory(): number {
    return this._idCategory;
  }

  set idCategory(value: number) {
    this._idCategory = value;
  }

  get category(): InventoryCategory | null {
    return this._category;
  }

  set category(value: InventoryCategory | null) {
    this._category = value;
  }

  get supplier(): Supplier | null {
    return this._supplier;
  }

  set supplier(value: Supplier | null) {
    this._supplier = value;
  }

  get idSupplier(): number {
    return this._idSupplier;
  }

  set idSupplier(value: number) {
    this._idSupplier = value;
  }
  get status(): InventoryStatus {
    if (this._currentStock <= this._minimumStockLevel) {
      return InventoryStatus.REFILL_NEEDED;
    }

    if (this._currentStock <= this._minimumStockLevel * 1.5) {
      return InventoryStatus.LOW_STOCK;
    }

    return InventoryStatus.IN_STOCK;
  }
}
