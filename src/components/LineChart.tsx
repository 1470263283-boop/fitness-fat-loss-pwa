interface LineChartProps {
  data: { date: string; value: number }[];
  suffix?: string;
}

export function LineChart({ data, suffix = 'kg' }: LineChartProps) {
  if (data.length < 2) {
    return <div className="chart-empty">还没有足够记录，继续记录后这里会显示趋势。</div>;
  }

  const width = 320;
  const height = 150;
  const padding = 18;
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((item.value - min) / span) * (height - padding * 2);
    return { ...item, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const last = points[points.length - 1];

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="趋势折线图">
        <path d={`M ${padding} ${height - padding} H ${width - padding}`} className="axis" />
        <path d={`M ${padding} ${padding} V ${height - padding}`} className="axis" />
        <path d={path} className="trend-line" />
        {points.map((point) => (
          <circle key={point.date} cx={point.x} cy={point.y} r="3.8" className="trend-dot" />
        ))}
        <text x={last.x - 48} y={Math.max(16, last.y - 10)} className="chart-label">
          {last.value.toFixed(1)}
          {suffix}
        </text>
      </svg>
    </div>
  );
}
