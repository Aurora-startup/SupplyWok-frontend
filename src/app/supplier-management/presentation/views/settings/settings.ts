import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SupplierManagementStore } from '../../../application/supplier-management-store';
import { SupplierSettings } from '../../../domain/model/supplier-settings.entity';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, TranslateModule, ButtonModule, CardModule, InputTextModule, ToggleSwitchModule, TagModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  readonly store = inject(SupplierManagementStore);
  formModel = new SupplierSettings();
  zoneDraft = '';

  constructor() {
    effect(() => {
      const settings = this.store.supplierSettings();
      this.formModel = new SupplierSettings({
        id: settings.id,
        supplierName: settings.supplierName,
        supportContact: settings.supportContact,
        notifications: { ...settings.notifications },
        serviceZones: [...settings.serviceZones],
        contacts: [...settings.contacts]
      });
    });
  }

  ngOnInit(): void {
    this.store.loadSupplierSettings();
  }

  addZone(): void {
    const zone = this.zoneDraft.trim();
    if (!zone) return;
    this.formModel.serviceZones = [...this.formModel.serviceZones, zone];
    this.zoneDraft = '';
  }

  removeZone(zone: string): void {
    this.formModel.serviceZones = this.formModel.serviceZones.filter((item) => item !== zone);
  }

  save(): void {
    this.store.updateSupplierSettings({
      id: this.formModel.id,
      supplierName: this.formModel.supplierName,
      supportContact: this.formModel.supportContact,
      notifications: this.formModel.notifications,
      serviceZones: this.formModel.serviceZones,
      contacts: this.formModel.contacts
    });
  }
}
