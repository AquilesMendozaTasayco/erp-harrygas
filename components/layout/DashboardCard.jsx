"use client";
import { motion } from "framer-motion";

export function DashboardCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white border rounded-2xl shadow-sm p-5 flex items-center justify-between cursor-default"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-xl ${color} flex items-center justify-center`}
      >
        <Icon size={26} />
      </div>
    </motion.div>
  );
}
