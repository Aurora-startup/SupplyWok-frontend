import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export interface SubscriptionSummaryItem {
  key: string;
  value: string;
}

export interface SupplierSubscriptionPlan {
  id?: string;
  name: string;
  price: string;
  isActive: boolean;
  features: string[];
}

export class SupplierSubscription implements BaseEntity {
  private _id: number | string | null;
  private _currentPlan: string;
  private _summary: SubscriptionSummaryItem[];
  private _plans: SupplierSubscriptionPlan[];

  constructor(subscription: {
    id?: number | string | null;
    currentPlan?: string;
    summary?: SubscriptionSummaryItem[];
    plans?: SupplierSubscriptionPlan[];
  } = {}) {
    this._id = subscription.id ?? null;
    this._currentPlan = subscription.currentPlan ?? '';
    this._summary = subscription.summary ?? [];
    this._plans = subscription.plans ?? [];
  }

  get id(): number | string | null { return this._id; }
  set id(value: number | string | null) { this._id = value; }
  get currentPlan(): string { return this._currentPlan; }
  set currentPlan(value: string) { this._currentPlan = value; }
  get summary(): SubscriptionSummaryItem[] { return this._summary; }
  set summary(value: SubscriptionSummaryItem[]) { this._summary = value; }
  get plans(): SupplierSubscriptionPlan[] { return this._plans; }
  set plans(value: SupplierSubscriptionPlan[]) { this._plans = value; }
}
