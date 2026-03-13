const formatTimeRemaining = (ms) => {
  if (!ms || ms <= 0) return null;

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `~${hours}h ${minutes}m`;
  }
  return `~${minutes}m`;
};

const WINDOW_OPTIONS = [
  { value: 10, label: '10m' },
  { value: 20, label: '20m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
];

export function StatusHeader({
  deviceName,
  battery,
  batteryTimeRemaining,
  connected,
  onConnect,
  onDisconnect,
  isConnecting,
  useSimulation,
  onSimulationChange,
  onResetData,
  windowMinutes,
  onWindowChange
}) {
  const batteryColor = battery !== null && battery < 20 ? 'text-red-500' : 'text-green-400';
  const timeRemaining = formatTimeRemaining(batteryTimeRemaining);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center gap-3">
        {connected ? (
          <>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium text-lg">{deviceName}</span>
            <button
              onClick={onDisconnect}
              className="ml-2 px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Disconnect
            </button>
            <button
              onClick={onResetData}
              className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Reset
            </button>
            <div className="flex items-center gap-1 ml-2">
              {WINDOW_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onWindowChange(opt.value)}
                  className={`px-2 py-1 text-sm rounded transition-colors ${
                    windowMinutes === opt.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-slate-500 rounded-full" />
            <button
              onClick={onConnect}
              disabled={isConnecting || useSimulation}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect VectorVario'}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!connected && (
          <button
            onClick={() => onSimulationChange(true)}
            disabled={isConnecting}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-slate-300"
          >
            Start Sim
          </button>
        )}

        {connected && battery !== null && (
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${batteryColor}`}>
              🔋 {battery}%
            </span>
            {timeRemaining && (
              <span className="text-slate-400 text-sm">
                ({timeRemaining})
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
