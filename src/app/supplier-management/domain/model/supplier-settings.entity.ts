import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface SupplierNotifications {
  email: boolean;
  sms: boolean;
}

export interface SupplierContact {
  name: string;
  state: string;
}

export class SupplierSettings implements BaseEntity {
  private _id: number | string | null;
  private _supplierName: string;
  private _supportContact: string;
  private _notifications: SupplierNotifications;
  private _serviceZones: string[];
  private _contacts: SupplierContact[];

  constructor(settings: {
    id?: number | string | null;
    supplierName?: string;
    supportContact?: string;
    notifications?: SupplierNotifications;
    serviceZones?: string[];
    contacts?: SupplierContact[];
  } = {}) {
    this._id = settings.id ?? null;
    this._supplierName = settings.supplierName ?? '';
    this._supportContact = settings.supportContact ?? '';
    this._notifications = settings.notifications ?? { email: false, sms: false };
    this._serviceZones = settings.serviceZones ?? [];
    this._contacts = settings.contacts ?? [];
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get supplierName(): string { return this._supplierName; }
  set supplierName(value: string) { this._supplierName = value; }
  get supportContact(): string { return this._supportContact; }
  set supportContact(value: string) { this._supportContact = value; }
  get notifications(): SupplierNotifications { return this._notifications; }
  set notifications(value: SupplierNotifications) { this._notifications = value; }
  get serviceZones(): string[] { return this._serviceZones; }
  set serviceZones(value: string[]) { this._serviceZones = value; }
  get contacts(): SupplierContact[] { return this._contacts; }
  set contacts(value: SupplierContact[]) { this._contacts = value; }
}
