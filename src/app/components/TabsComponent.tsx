"use client";

import React, { useState } from "react";
import TimeSlotsComponent from "./TimeSlotsComponent";

type Employee = {
  [key: string]: {
    grid: number;
  };
};

const employees: Employee = {
  grid1: { grid: 1 },
  grid2: { grid: 2 },
  grid3: { grid: 3 },
  grid4: { grid: 4 },
  grid5: { grid: 5 },
  grid6: { grid: 6 },
  grid7: { grid: 7 },
  grid8: { grid: 8 },
  grid9: { grid: 9 },
  grid10: { grid: 10 },
  grid11: { grid: 11 },
  grid12: { grid: 12 },
};

const TabsComponent: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>(
    Object.keys(employees)[0]
  );

  const handleTabClick = (employee: string) => {
    setSelectedEmployee(employee);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-400 ">
        <ul className="flex flex-wrap -mb-px">
          {Object.keys(employees).map((employee) => (
            <li
              key={employee}
              className={`${
                selectedEmployee === employee
                  ? "text-primary border-primary"
                  : ""
              } inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:text-gray-300 cursor-pointer`}
              onClick={() => handleTabClick(employee)}
            >
              {`${employee.split("d")[0]}d ${employee.split("d")[1]}`}
            </li>
          ))}
        </ul>

        <TimeSlotsComponent
          employee={selectedEmployee}
          grid={employees[selectedEmployee].grid}
          selectedEmployee={selectedEmployee}
          selectedGrid={employees[selectedEmployee].grid}
        />
      </div>
    </div>
  );
};

export default TabsComponent;
