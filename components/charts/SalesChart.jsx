"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ventas/semana");
      const json = await res.json();
      setData(json.data ?? []);
    }
    load();
  }, []);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
