import React, { useState, useEffect } from "react";
import HourInput from "./HourInput";

// Define the structure of a time slot
interface TimeSlot {
  date: string; // ISO 8601 formatted date with time
  active: boolean;
}

interface DaySlots {
  date: string; // Date in 'YYYY-MM-DD' format
  timeSlots: TimeSlot[]; // Array of time slots for this date
}

interface EmployeeTimeSlotsComponentProps {
  employee: string;
  selectedGrid: number;
  grid: number;
  selectedEmployee: string;
}

const TimeSlotsComponent: React.FC<EmployeeTimeSlotsComponentProps> = ({
  selectedGrid,
}) => {
  const [daysWithSlots, setDaysWithSlots] = useState<DaySlots[][]>([]);
  const [result, setResult] = useState<string>(""); // State for textarea result

  // Function to generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const startHour = 6; // Start at 6 AM
    const endHour = 18; // End at 6 PM
    const intervalMinutes = 15; // 15-minute intervals
    const slots: TimeSlot[] = [];
    const currentDate = new Date();

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const date = new Date(currentDate);
        date.setHours(hour, minute, 0, 0); // Set hours and minutes
        // Convert to UTC-3 for Brazilian timezone
        date.setHours(date.getHours() - 3);
        slots.push({
          date: date.toISOString(),
          active: false, // Set active to false by default
        });
      }
    }

    return slots;
  };

  // Use effect to generate the days and their slots for all grids (1-12)
  useEffect(() => {
    const slots = generateTimeSlots();
    const currentWeekDates = getCurrentWeekDates();

    // Combine the current week dates with time slots for each grid (1 to 12)
    const allGrids = [];
    for (let grid = 1; grid <= 12; grid++) {
      const combinedDays = currentWeekDates.map((day) => ({
        date: day,
        timeSlots: slots.map((slot) => ({
          ...slot,
          date: slot.date.split("T")[1], // Keep time part
        })),
      }));
      allGrids.push(combinedDays);
    }

    setDaysWithSlots(allGrids);
  }, []);

  // Function to get the current week dates
  function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    // Collect all dates of the current week
    const datesOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i); // Add days incrementally
      datesOfWeek.push(day.toISOString().split("T")[0]); // Return as 'YYYY-MM-DD'
    }

    return datesOfWeek;
  }

  // Handle active toggle for the selected grid
  const toggleActive = (dayIndex: number, slotIndex: number) => {
    setDaysWithSlots((prevGrids) =>
      prevGrids.map((grid, gridIndex) =>
        gridIndex === selectedGrid - 1 // Only modify the selected grid
          ? grid.map((day, i) =>
              i === dayIndex
                ? {
                    ...day,
                    timeSlots: day.timeSlots.map((slot, j) =>
                      j === slotIndex ? { ...slot, active: !slot.active } : slot
                    ),
                  }
                : day
            )
          : grid
      )
    );
  };

  // Function to save the info from all grids
  const saveInfo = () => {
    const allGridsInfo = daysWithSlots.flatMap((grid, gridIndex) =>
      grid.flatMap((day) =>
        day.timeSlots.map((slot) => ({
          grid: gridIndex + 1, // Grid index starts from 1
          date: `${day.date}T${slot.date}`, // Concatenate day and time
          active: slot.active,
        }))
      )
    );

    // Set the result in the state to display in the textarea
    setResult(JSON.stringify(allGridsInfo, null, 2)); // Pretty print the result
  };

  // Função para copiar o conteúdo do textarea
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(result)
      .then(() => {
        alert("Conteúdo copiado!");
      })
      .catch((err) => {
        console.error("Erro ao copiar:", err);
      });
  };

  const formatDateWithWeekday = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");

    // Array with days of the week, starting from Sunday (0)
    const weekdays = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];

    // Get the correct day of the week
    const weekday = weekdays[date.getDay()];

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${weekday}, ${day}/${month}/${year}`;
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold mt-5">Grid {selectedGrid}</h2>
        <ul className="flex justify-center mt-5 gap-4">
          {daysWithSlots[selectedGrid - 1]?.map((day, dayIndex) => (
            <div key={day.date} className="border p-4 rounded">
              <h2 className="text-lg font-bold">
                {formatDateWithWeekday(day.date)}
              </h2>
              <ul className="grid grid-cols-3 gap-1">
                {day.timeSlots.map((slot, slotIndex) => (
                  <HourInput
                    key={slot.date}
                    index={slotIndex}
                    slot={slot}
                    toggleActive={() => toggleActive(dayIndex, slotIndex)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>

      <button
        onClick={saveInfo}
        className="my-5 bg-green-500 py-3 px-5 rounded-md text-gray-50"
      >
        Salvar informações
      </button>

      <div className="relative">
        <textarea
          className="w-full h-96 p-2 border rounded-md text-gray-50 bg-slate-600 border-none"
          value={result} // Bind the result state to the textarea
          readOnly
        ></textarea>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-6 bg-blue-500 text-white py-1 px-3 rounded-md"
        >
          Copiar
        </button>
      </div>
    </div>
  );
};

export default TimeSlotsComponent;
