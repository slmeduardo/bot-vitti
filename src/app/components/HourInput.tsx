"use client";

import React from "react";

// Define the props for HourInput
interface HourInputProps {
  index: number;
  slot: {
    date: string; // ISO 8601 formatted date with time
    active: boolean; // Indicates if the slot is active
  };
  toggleActive: (index: number) => void; // Function to toggle active state
}

const HourInput: React.FC<HourInputProps> = ({ index, slot, toggleActive }) => {
  return (
    <li className="py-2">
      <button
        onClick={() => toggleActive(index)} // Call toggleActive with the index
        className={`${
          slot.active ? "bg-green-400 active" : "bg-red-400"
        } px-2 py-1 rounded-md text-xs text-gray-700`}
      >
        {`${slot.date.split(":")[0]}:${slot.date.split(":")[1]}`}
      </button>
    </li>
  );
};

export default HourInput;
