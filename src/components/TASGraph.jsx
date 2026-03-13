import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: false });
};

export function TASGraph({ data, windowMinutes = 10 }) {
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

  // Filter data to window
  const windowData = useMemo(() => {
    return data.filter(d => d.time >= minTime);
  }, [data, minTime]);

  return (
    <div className="bg-slate-800 rounded-xl p-2 sm:p-4 border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-300 mb-2">True Airspeed</h2>
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={windowData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
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
              stroke="#64748b"
              domain={[0, 'auto']}
              tickFormatter={(v) => `${v}`}
              width={35}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelFormatter={formatTime}
              formatter={(value) => value !== null ? [`${value.toFixed(1)} km/h`, 'TAS'] : ['--', 'TAS']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
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
