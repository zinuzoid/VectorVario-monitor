/**
 * VectorVario BLE Service
 * Handles Web Bluetooth connection and data parsing for VectorVario sensor
 */

// BLE UUIDs
const ENV_SENSING_SERVICE = 0x181a;
const BATTERY_SERVICE = 0x180f;
const TAS_SERVICE = '2fce4890-0197-47e0-a825-d4777b9a5d67';

const TEMP_CHAR = 0x2a6e;
const HUMIDITY_CHAR = 0x2a6f;
const TAS_CHAR = '2fce4892-0197-47e0-a825-d4777b9a5d67';
const BATTERY_CHAR = 0x2a19;

export class VectorVarioService {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristics = {
      temperature: null,
      humidity: null,
      airspeed: null,
      battery: null,
    };
    this.callbacks = {
      onTemperature: null,
      onHumidity: null,
      onAirspeed: null,
      onBattery: null,
      onDisconnect: null,
    };
  }

  async connect() {
    try {
      // Request device with required services
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: '[VV]' }],
        optionalServices: [ENV_SENSING_SERVICE, BATTERY_SERVICE, TAS_SERVICE],
      });

      this.device.addEventListener('gattserverdisconnected', () => {
        this.callbacks.onDisconnect?.();
      });

      // Connect to GATT server
      this.server = await this.device.gatt.connect();

      // Get services and characteristics
      await this._setupCharacteristics();

      return {
        connected: true,
        deviceName: this.device.name || 'VectorVario',
      };
    } catch (error) {
      console.error('BLE Connection error:', error);
      throw error;
    }
  }

  async _setupCharacteristics() {
    try {
      // Environmental Sensing Service
      const envService = await this.server.getPrimaryService(ENV_SENSING_SERVICE);

      this.characteristics.temperature = await envService.getCharacteristic(TEMP_CHAR);
      await this.characteristics.temperature.startNotifications();
      this.characteristics.temperature.addEventListener('characteristicvaluechanged', (e) => {
        const value = this._parseTemperature(e.target.value);
        this.callbacks.onTemperature?.(value);
      });

      this.characteristics.humidity = await envService.getCharacteristic(HUMIDITY_CHAR);
      await this.characteristics.humidity.startNotifications();
      this.characteristics.humidity.addEventListener('characteristicvaluechanged', (e) => {
        const value = this._parseHumidity(e.target.value);
        this.callbacks.onHumidity?.(value);
      });

      // Battery Service
      const batteryService = await this.server.getPrimaryService(BATTERY_SERVICE);
      this.characteristics.battery = await batteryService.getCharacteristic(BATTERY_CHAR);
      await this.characteristics.battery.startNotifications();
      this.characteristics.battery.addEventListener('characteristicvaluechanged', (e) => {
        const value = this._parseBattery(e.target.value);
        this.callbacks.onBattery?.(value);
      });

      // TAS Service (custom)
      const tasService = await this.server.getPrimaryService(TAS_SERVICE);
      this.characteristics.airspeed = await tasService.getCharacteristic(TAS_CHAR);
      await this.characteristics.airspeed.startNotifications();
      this.characteristics.airspeed.addEventListener('characteristicvaluechanged', (e) => {
        const value = this._parseAirspeed(e.target.value);
        this.callbacks.onAirspeed?.(value);
      });

      // Read initial values
      await this._readInitialValues();
    } catch (error) {
      console.error('Error setting up characteristics:', error);
      throw error;
    }
  }

  async _readInitialValues() {
    try {
      if (this.characteristics.temperature) {
        const tempValue = await this.characteristics.temperature.readValue();
        this.callbacks.onTemperature?.(this._parseTemperature(tempValue));
      }
      if (this.characteristics.humidity) {
        const humValue = await this.characteristics.humidity.readValue();
        this.callbacks.onHumidity?.(this._parseHumidity(humValue));
      }
      if (this.characteristics.battery) {
        const batValue = await this.characteristics.battery.readValue();
        this.callbacks.onBattery?.(this._parseBattery(batValue));
      }
      if (this.characteristics.airspeed) {
        const tasValue = await this.characteristics.airspeed.readValue();
        this.callbacks.onAirspeed?.(this._parseAirspeed(tasValue));
      }
    } catch (error) {
      console.error('Error reading initial values:', error);
    }
  }

  // Parse Sint16 in 0.01°C units (Little Endian)
  _parseTemperature(dataView) {
    const raw = dataView.getInt16(0, true); // true = little endian
    return raw / 100; // Convert to °C
  }

  // Parse Uint16 in 0.01% units (Little Endian)
  _parseHumidity(dataView) {
    const raw = dataView.getUint16(0, true);
    return raw / 100; // Convert to %
  }

  // Parse Uint16 in 0.1 km/h units (Little Endian)
  _parseAirspeed(dataView) {
    const raw = dataView.getUint16(0, true);
    return raw / 10; // Convert to km/h
  }

  // Parse Uint8 percentage
  _parseBattery(dataView) {
    return dataView.getUint8(0);
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  disconnect() {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.server = null;
    this.characteristics = {
      temperature: null,
      humidity: null,
      airspeed: null,
      battery: null,
    };
  }

  get isConnected() {
    return this.device?.gatt?.connected ?? false;
  }

  get deviceName() {
    return this.device?.name || null;
  }
}

export const vectorVarioService = new VectorVarioService();
