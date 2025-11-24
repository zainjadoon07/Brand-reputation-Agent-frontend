import React from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

export default function DatePickerInput({ label, selectedDate, setSelectedDate }) {
  return (
    <div className="flex flex-col mb-4 relative">
      <label className="mb-1 text-gray-300">{label}</label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-2 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
