import { useState, useEffect, useCallback, useRef } from 'react';
import { vectorVarioService } from '../services/VectorVarioService';

const WINDOW_MS = 3600000; // keep 1 hour of data (max window size)

// Time-based buffer - prunes anything older than window
export const addToBuffer = (buffer, point, windowMs) => {
  const cutoff = point.time - windowMs;
  const pruned = buffer.filter(p => p.time > cutoff);
  return [...pruned, point];
};

export function useVectorVario(useSimulation = false) {
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState(null);
  const [battery, setBattery] = useState(null);
  const [batteryTimeRemaining, setBatteryTimeRemaining] = useState(null);
  const [currentTAS, setCurrentTAS] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [tasHistory, setTasHistory] = useState([]);
  const [tempHistory, setTempHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const simulationRef = useRef(null);
  const startTimeRef = useRef(null);
  const batteryHistoryRef = useRef([]);
  const wakeLockRef = useRef(null);

  // Screen Wake Lock — keep display on while connected
  useEffect(() => {
    if (!connected) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      return;
    }

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {
        // Wake lock request can fail (e.g. low battery, browser policy)
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connected) {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [connected]);

  const updateBattery = useCallback((value) => {
    const now = Date.now();
    setBattery(value);

    // Add to battery history
    batteryHistoryRef.current.push({ time: now, value });

    // Keep only last 30 minutes of battery data for estimation
    const cutoff = now - 30 * 60 * 1000;
    batteryHistoryRef.current = batteryHistoryRef.current.filter(p => p.time > cutoff);

    // Calculate drain rate and estimate time remaining
    const history = batteryHistoryRef.current;
    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const timeDiffMs = newest.time - oldest.time;
      const batteryDiff = oldest.value - newest.value;

      if (timeDiffMs > 60000 && batteryDiff > 0) {
        // Calculate drain rate (% per ms)
        const drainRatePerMs = batteryDiff / timeDiffMs;
        // Time remaining until 0%
        const msRemaining = newest.value / drainRatePerMs;
        setBatteryTimeRemaining(msRemaining);
      } else {
        setBatteryTimeRemaining(null);
      }
    }
  }, []);

  const getTimestamp = useCallback(() => {
    return Date.now(); // browser timestamp in ms
  }, []);

  const addDataPoint = useCallback((type, value) => {
    const timestamp = getTimestamp();
    const point = { time: timestamp, value };
    setLastUpdate(timestamp);

    switch (type) {
      case 'tas':
        setCurrentTAS(value);
        setTasHistory(prev => addToBuffer(prev, point, WINDOW_MS));
        break;
      case 'temp':
        setCurrentTemp(value);
        setTempHistory(prev => addToBuffer(prev, point, WINDOW_MS));
        break;
      case 'humidity':
        setCurrentHumidity(value);
        setHumidityHistory(prev => addToBuffer(prev, point, WINDOW_MS));
        break;
    }
  }, [getTimestamp]);

  // Simulation mode
  useEffect(() => {
    if (!useSimulation) return;

    setConnected(true);
    setDeviceName('VectorVario (Sim)');
    setBattery(85);
    startTimeRef.current = Date.now();

    let simTAS = 50;
    let simTemp = 20;
    let simHumidity = 50;

    const simulate = () => {
      // Random walk with bounds
      simTAS = Math.max(20, Math.min(100, simTAS + (Math.random() - 0.5) * 10));
      simTemp = Math.max(15, Math.min(25, simTemp + (Math.random() - 0.5) * 1));
      simHumidity = Math.max(40, Math.min(60, simHumidity + (Math.random() - 0.5) * 3));

      addDataPoint('tas', parseFloat(simTAS.toFixed(1)));
      addDataPoint('temp', parseFloat(simTemp.toFixed(2)));
      addDataPoint('humidity', parseFloat(simHumidity.toFixed(1)));
    };

    // Initial data points
    simulate();
    simulationRef.current = setInterval(simulate, 600);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [useSimulation, addDataPoint]);

  // Real BLE connection
  const connect = useCallback(async () => {
    if (useSimulation) return;

    setIsConnecting(true);
    setError(null);
    startTimeRef.current = Date.now();

    try {
      vectorVarioService.setCallbacks({
        onTemperature: (value) => addDataPoint('temp', value),
        onHumidity: (value) => addDataPoint('humidity', value),
        onAirspeed: (value) => addDataPoint('tas', value),
        onBattery: (value) => updateBattery(value),
        onDisconnect: () => {
          setConnected(false);
          setDeviceName(null);
        },
      });

      const result = await vectorVarioService.connect();
      setConnected(true);
      setDeviceName(result.deviceName);
    } catch (err) {
      setError(err.message || 'Failed to connect');
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [useSimulation, addDataPoint]);

  const disconnect = useCallback(() => {
    if (useSimulation) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      setConnected(false);
      setDeviceName(null);
      return;
    }

    vectorVarioService.disconnect();
    setConnected(false);
    setDeviceName(null);
  }, [useSimulation]);

  const resetData = useCallback(() => {
    setTasHistory([]);
    setTempHistory([]);
    setHumidityHistory([]);
    startTimeRef.current = Date.now();
  }, []);

  return {
    connected,
    deviceName,
    battery,
    batteryTimeRemaining,
    currentTAS,
    currentTemp,
    currentHumidity,
    tasHistory,
    tempHistory,
    humidityHistory,
    error,
    isConnecting,
    lastUpdate,
    connect,
    disconnect,
    resetData,
  };
}
