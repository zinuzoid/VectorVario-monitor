import { useState } from 'react';
import { useVectorVario } from './hooks/useVectorVario';
import { StatusHeader } from './components/StatusHeader';
import { BigNumber } from './components/BigNumber';
import { TASGraph } from './components/TASGraph';
import { EnvGraph } from './components/EnvGraph';

function App() {
  const [useSimulation, setUseSimulation] = useState(false);
  const [windowMinutes, setWindowMinutes] = useState(10);

  const {
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
  } = useVectorVario(useSimulation);

  const handleSimulationChange = (enabled) => {
    setUseSimulation(enabled);
  };

  const handleDisconnect = () => {
    disconnect();
    if (useSimulation) {
      setUseSimulation(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col high-contrast">
      <StatusHeader
        deviceName={deviceName}
        battery={battery}
        batteryTimeRemaining={batteryTimeRemaining}
        connected={connected}
        onConnect={connect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
        useSimulation={useSimulation}
        onSimulationChange={handleSimulationChange}
        onResetData={resetData}
        windowMinutes={windowMinutes}
        onWindowChange={setWindowMinutes}
      />

      <main className="flex-1 p-2 sm:p-4 space-y-4 w-full">
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300">
            {error}
          </div>
        )}

        {!connected && !useSimulation && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg mb-2">Connect to a VectorVario to start monitoring</p>
            <p className="text-sm">Or enable Simulation Mode to test the UI</p>
          </div>
        )}

        {connected && (
          <>
            {/* Big Number Readouts */}
            <div className="grid grid-cols-3 gap-2 bg-slate-800 rounded-xl border border-slate-700">
              <BigNumber
                label="🌡️ Temp"
                value={currentTemp}
                unit="°C"
                color="text-orange-400"
              />
              <BigNumber
                label="💧 Humidity"
                value={currentHumidity}
                unit="%"
                color="text-blue-400"
              />
              <BigNumber
                label="💨 TAS"
                value={currentTAS}
                unit="km/h"
                color="text-cyan-400"
              />
            </div>

            {/* Graphs */}
            <EnvGraph tempData={tempHistory} humidityData={humidityHistory} windowMinutes={windowMinutes} />
            <TASGraph data={tasHistory} windowMinutes={windowMinutes} />

            {lastUpdate && (
              <p className="text-center text-xs text-slate-500">
                📡 Last sensor update: {new Date(lastUpdate).toLocaleTimeString('en-US', { hour12: false })}
              </p>
            )}
          </>
        )}
      </main>

      <footer className="text-center py-3 text-slate-500 text-sm border-t border-slate-800">
        VectorVario Monitor · Made with ❤️ by ArmchairPilot 🪂
      </footer>
    </div>
  );
}

export default App;
