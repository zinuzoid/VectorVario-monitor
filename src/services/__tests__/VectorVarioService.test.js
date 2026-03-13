import { describe, it, expect } from 'vitest';
import { vectorVarioService } from '../VectorVarioService';

// Helper: create a DataView from typed array values
function int16View(value) {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setInt16(0, value, true); // little-endian
  return new DataView(buf);
}

function uint16View(value) {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setUint16(0, value, true);
  return new DataView(buf);
}

function uint8View(value) {
  const buf = new ArrayBuffer(1);
  new DataView(buf).setUint8(0, value);
  return new DataView(buf);
}

describe('VectorVarioService parsers', () => {
  describe('_parseTemperature', () => {
    it('parses positive temperature (25.50C)', () => {
      expect(vectorVarioService._parseTemperature(int16View(2550))).toBe(25.5);
    });

    it('parses negative temperature (-10.00C)', () => {
      expect(vectorVarioService._parseTemperature(int16View(-1000))).toBe(-10);
    });

    it('parses zero', () => {
      expect(vectorVarioService._parseTemperature(int16View(0))).toBe(0);
    });
  });

  describe('_parseHumidity', () => {
    it('parses standard humidity (65.25%)', () => {
      expect(vectorVarioService._parseHumidity(uint16View(6525))).toBe(65.25);
    });

    it('parses 100%', () => {
      expect(vectorVarioService._parseHumidity(uint16View(10000))).toBe(100);
    });

    it('parses 0%', () => {
      expect(vectorVarioService._parseHumidity(uint16View(0))).toBe(0);
    });
  });

  describe('_parseAirspeed', () => {
    it('parses airspeed (42.5 km/h)', () => {
      expect(vectorVarioService._parseAirspeed(uint16View(425))).toBe(42.5);
    });

    it('parses zero airspeed', () => {
      expect(vectorVarioService._parseAirspeed(uint16View(0))).toBe(0);
    });
  });

  describe('_parseBattery', () => {
    it('parses 85%', () => {
      expect(vectorVarioService._parseBattery(uint8View(85))).toBe(85);
    });

    it('parses 0%', () => {
      expect(vectorVarioService._parseBattery(uint8View(0))).toBe(0);
    });

    it('parses 100%', () => {
      expect(vectorVarioService._parseBattery(uint8View(100))).toBe(100);
    });
  });
});
