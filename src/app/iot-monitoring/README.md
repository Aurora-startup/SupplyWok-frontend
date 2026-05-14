# SupplyWok IoT Monitoring - Bounded Context

## Architecture Overview
This bounded context is responsible for real-time monitoring of IoT sensors (kitchen temperatures, cold storage, and dining room table occupancy) and generating reactive alerts. It is designed using a **Domain-Driven Design (DDD)** approach, heavily leveraging **Angular Signals** for reactive state management.

## State Management (`IotStore`)
The core of the data flow is managed by the `IotStore` (Backend-for-Frontend).
It acts as the single source of truth for the dashboard.

- **State**: The store maintains a list of `sensors`.
- **Computed Signals**:
  - `activeAlerts`: Derives a list of `Alert` entities dynamically by mapping each sensor through the `Alert.fromSensor()` factory method.
  - `recentAlerts`: Filters the `activeAlerts` to show the most recent 3 (used in the main panel).
  - `topCriticalAlerts`: Filters the `activeAlerts` to show up to 5 critical alerts (used in the header popup).
  - Derived metrics like `averageKitchenTemperature`, `lowStockStorageCount`, etc.

## Alert Generation
Alerts are generated **reactively** on the frontend based on the current state of the sensors.
The `Alert.fromSensor()` factory method evaluates business rules (e.g., if a kitchen sensor exceeds its `maxValue`) and returns an `Alert` entity populated with **i18n translation keys** instead of static text.

## Component Structure

### Presentation Layer
The UI is composed of several modular standalone components that inject the `IotStore`.

- **`IotStatCard` & Wrappers (`ActiveTablesCard`, `LowStockCard`, `TempAlertCard`)**
  Display high-level metrics as small widgets. They inject the store, read computed signals, and render the results using the `app-iot-stat-card` base layout.

- **`PanelItemCard` & Wrappers (`KitchenPanelCard`, `StoragePanelCard`, `DiningPanelCard`)**
  Display detailed sections with progress bars. They inject the store, read values, and calculate a percentage to fill the visual bars.

- **`IotPanelCard`**
  The main container component that groups the three domain panels (Kitchen, Storage, Dining) alongside a list of the 3 most recent alerts. It relies on its own scoped CSS for layout (`max-width`) ensuring it is responsive and self-contained.

- **`AlertItemComponent`**
  A base component that takes an `Alert` input and renders it. It uses `ngx-translate` to translate the alert's keys (`titleKey`, `messageKey`) dynamically, substituting any parameters.

- **`HeaderAlertsPopupComponent`**
  A popup component designed to be toggled from the application header, showing the 5 most critical alerts.

## Initialization
When a developer wants to use the dashboard, the components self-initialize the state:
1. The `IotStore` automatically loads a list of demo sensors upon initialization via the `IotMonitoringApi`.
2. Computed signals immediately react and populate the derived values (averages, low stock counts, alerts).
3. The standalone UI components simply inject the `IotStore` and bind their templates directly to the computed signals. No manual subscriptions or complex lifecycle hooks are required.

## Internationalization (i18n)
All text in the IoT Monitoring bounded context supports `ngx-translate`.
Alert rules define keys like `IOT.ALERTS.TEMP_BREACH_MSG`, and the UI components utilize the `| translate` pipe to display the correct language based on `en.json`, `es.json`, and `zh.json`.
