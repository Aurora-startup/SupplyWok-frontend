import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Supplier implements BaseEntity {
  id: number | string | null;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  linkedDate: string;
  sla: string;
  responseTime: string;

  constructor({
    id = null,
    name = '',
    contactName = '',
    email = '',
    phone = '',
    category = '',
    linkedDate = '',
    sla = '',
    responseTime = ''
  }: {
    id?: number | string | null;
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    category?: string;
    linkedDate?: string;
    sla?: string;
    responseTime?: string;
  }) {
    this.id = id;
    this.name = name;
    this.contactName = contactName;
    this.email = email;
    this.phone = phone;
    this.category = category;
    this.linkedDate = linkedDate;
    this.sla = sla;
    this.responseTime = responseTime;
  }
}
