'use client';

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#e60023', '#7e238b', '#10b981', '#f59e0b', '#ef4444', '#62625b'];

export function LineChartCard({ data = [], xKey, yKey, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
        <XAxis dataKey={xKey} stroke="#91918c" fontSize={12} />
        <YAxis stroke="#91918c" fontSize={12} />
        <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e5e5e0', fontSize: 12, backgroundColor: '#ffffff' }} />
        <Line type="monotone" dataKey={yKey} stroke="#e60023" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartCard({ data = [], xKey, yKey, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
        <XAxis dataKey={xKey} stroke="#91918c" fontSize={12} />
        <YAxis stroke="#91918c" fontSize={12} />
        <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e5e5e0', fontSize: 12, backgroundColor: '#ffffff' }} />
        <Bar dataKey={yKey} fill="#e60023" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieChartCard({ data = [], nameKey, valueKey, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e5e5e0', fontSize: 12, backgroundColor: '#ffffff' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
