export default function ResultCard({ title, children }) {
  return (
    <div className="p-6 mt-6 bg-[#0d0d0d] rounded-xl border border-gray-700 shadow-xl text-gray-200">
      <h2 className="text-xl mb-3 text-purple-400">{title}</h2>
      {children}
    </div>
  );
}
