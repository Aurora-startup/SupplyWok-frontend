import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { IotStore } from '../../../application/iot-store';
import { Sensor } from '../../../domain/model/sensor.entity';

@Component({
  selector: 'app-sensors-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    DialogModule,
    TooltipModule
  ],
  templateUrl: './sensors-view.component.html',
  styleUrls: ['./sensors-view.component.css']
})
export class SensorsViewComponent implements OnInit {
  searchQuery = signal('');
  selectedType = signal<string>('All');
  
  displayDialog = false;
  isEditMode = false;
  selectedSensor: Sensor | null = null;

  // Form model for editing
  editForm = {
    id: 0,
    name: '',
    type: 'Temperature',
    minValue: 0,
    maxValue: 0,
    enabled: true,
    lastValue: 0
  };

  types = [
    { labelKey: 'iot.sensors-page.types.all', value: 'All' },
    { labelKey: 'iot.sensors-page.types.temperature', value: 'Temperature' },
    { labelKey: 'iot.sensors-page.types.humidity', value: 'Humidity' },
    { labelKey: 'iot.sensors-page.types.weight', value: 'Weight' }
  ];

  editTypes = [
    { labelKey: 'iot.sensors-page.types.temperature', value: 'Temperature' },
    { labelKey: 'iot.sensors-page.types.humidity', value: 'Humidity' },
    { labelKey: 'iot.sensors-page.types.weight', value: 'Weight' }
  ];

  filteredSensors = computed(() => {
    let list = this.iotStore.sensors();
    
    const query = this.searchQuery().toLowerCase();
    if (query) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(query)
      );
    }

    const typeFilter = this.selectedType();
    if (typeFilter !== 'All') {
      list = list.filter(s => {
        // Map domain type (which might be kitchen-temperature, storage-pressure, etc.) to base types
        const t = s.type.toLowerCase();
        if (typeFilter === 'Temperature') {
          return t.includes('temp') || t === 'temperature';
        }
        if (typeFilter === 'Weight') {
          return t.includes('pressure') || t === 'weight';
        }
        return t === typeFilter.toLowerCase();
      });
    }

    return list;
  });

  constructor(public iotStore: IotStore, private router: Router) {}

  ngOnInit(): void {
    this.iotStore.loadSensors();
  }

  getDisplayType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('temp') || t === 'temperature') {
      return 'Temperature';
    }
    if (t.includes('pressure') || t === 'weight') {
      return 'Weight';
    }
    if (t === 'humidity') {
      return 'Humidity';
    }
    return type;
  }

  goBack(): void {
    void this.router.navigateByUrl('/restaurant/alerts');
  }

  showCreateDialog(): void {
    this.selectedSensor = null;
    this.isEditMode = false;
    this.editForm = {
      id: 0,
      name: '',
      type: 'Temperature',
      minValue: 0,
      maxValue: 100,
      enabled: true,
      lastValue: 20
    };
    this.displayDialog = true;
  }

  showEditDialog(sensor: Sensor): void {
    this.selectedSensor = sensor;
    this.isEditMode = true;
    this.editForm = {
      id: sensor.id,
      name: sensor.name,
      type: this.getDisplayType(sensor.type),
      minValue: sensor.minValue,
      maxValue: sensor.maxValue,
      enabled: sensor.enabled,
      lastValue: sensor.lastValue
    };
    this.displayDialog = true;
  }

  saveSensor(): void {
    const sensorData = new Sensor({
      id: this.isEditMode && this.selectedSensor ? this.editForm.id : undefined,
      name: this.editForm.name,
      minValue: this.editForm.minValue,
      maxValue: this.editForm.maxValue,
      enabled: this.editForm.enabled,
      lastValue: this.editForm.lastValue,
      type: this.editForm.type // Save backend type representation with exact casing
    });

    if (this.isEditMode) {
      this.iotStore.updateSensor(sensorData);
    } else {
      this.iotStore.addSensor(sensorData);
    }
    this.displayDialog = false;
  }
}
