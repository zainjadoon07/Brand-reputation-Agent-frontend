export default function InputField({ label, value, setValue, placeholder }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-300 mb-1">{label}</label>
      <input
        className="p-3 rounded-lg bg-[#111] text-gray-100 border border-gray-700 focus:border-purple-400 focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
