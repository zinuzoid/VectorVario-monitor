import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: false });
};

export function EnvGraph({ tempData, humidityData, windowMinutes = 10 }) {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const minTime = now - windowMs;

  // Generate stable tick values - adjust interval based on window size
  const tickInterval = windowMinutes <= 10 ? 60000 : windowMinutes <= 30 ? 300000 : 600000;
  const ticks = useMemo(() => {
    const result = [];
    const firstTick = Math.ceil(minTime / tickInterval) * tickInterval;
    for (let t = firstTick; t <= now; t += tickInterval) {
      result.push(t);
    }
    return result;
  }, [minTime, now, tickInterval]);

  // Merge temp and humidity data by time for combined chart
  const mergedData = useMemo(() => {
    const timeMap = new Map();

    tempData.forEach(d => {
      if (d.time >= minTime) {
        timeMap.set(d.time, { time: d.time, temp: d.value });
      }
    });

    humidityData.forEach(d => {
      if (d.time >= minTime) {
        const existing = timeMap.get(d.time) || { time: d.time };
        timeMap.set(d.time, { ...existing, humidity: d.value });
      }
    });

    return Array.from(timeMap.values()).sort((a, b) => a.time - b.time);
  }, [tempData, humidityData, minTime]);

  return (
    <div className="bg-slate-800 rounded-xl p-2 sm:p-4 border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-300 mb-2">🌡️ Environment</h2>
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tickFormatter={formatTime}
              domain={[minTime, now]}
              type="number"
              scale="time"
              ticks={ticks}
            />
            <YAxis
              yAxisId="temp"
              stroke="#f97316"
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v.toFixed(1)}°`}
              width={48}
            />
            <YAxis
              yAxisId="humidity"
              orientation="right"
              stroke="#3b82f6"
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              width={50}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelFormatter={formatTime}
              formatter={(value, name) => {
                if (value === null) return ['--', name];
                if (name === 'Temperature') return [`${value.toFixed(2)}°C`, 'Temperature'];
                return [`${value.toFixed(2)}%`, 'Humidity'];
              }}
            />
            <Legend />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              name="Temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls={true}
            />
            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              name="Humidity"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
