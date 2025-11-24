import { useState, useRef, useEffect } from "react";
import InputField from "../components/InputField";
import { validateBrandInput } from "../utils/validators";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Custom DatePicker Input
const DatePickerInput = ({ label, selectedDate, setSelectedDate }) => (
  <div className="flex flex-col mb-4 relative">
    <label className="mb-1 text-gray-300">{label}</label>
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="w-full p-2 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        dateFormat="yyyy-MM-dd"
        placeholderText="Select date"
        maxDate={new Date("2024-12-31")}
        minDate={new Date("2010-01-01")}
      />
      <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const loadingMessages = [
  "Analyzing the brand reputation...",
  "Scanning social media mentions...",
  "Detecting suspicious posts...",
  "Compiling the summary...",
  "Preparing recommendations...",
  "Fetching top sources..."
];

export default function AnalyzePage() {
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("webservice");
  const [sources, setSources] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(""); // Validation or network errors
  const [backendError, setBackendError] = useState(""); // Backend returned error
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Health Modal States
  const [healthOpen, setHealthOpen] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [healthError, setHealthError] = useState("");

  const resultRef = useRef(null);
  const loadingIntervalRef = useRef(null);

  useEffect(() => {
    if (result || error || backendError) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, error, backendError]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMessage(loadingMessages[i]);
    loadingIntervalRef.current = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[i]);
    }, 1500);
  };

  const stopLoadingMessages = () => {
    clearInterval(loadingIntervalRef.current);
    setLoadingMessage("");
  };

  const analyzeBrand = async () => {
    setIsLoading(true);
    startLoadingMessages();
    setError("");
    setBackendError("");
    setResult(null);

    const today = new Date();
    if (startDate && startDate > today) {
      setError("Start date cannot be in the future");
      setIsLoading(false);
      stopLoadingMessages();
      return;
    }
    if (endDate && endDate > today) {
      setError("End date cannot be in the future");
      setIsLoading(false);
      stopLoadingMessages();
      return;
    }

    const body = {
      brand_name: brand,
      Type: type,
      date_range:
        startDate && endDate
          ? `${formatDate(startDate)} to ${formatDate(endDate)}`
          : "",
      sources: sources ? sources.split(",") : [],
    };

    const validationError = validateBrandInput(body);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      stopLoadingMessages();
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.error_message) {
        setBackendError(data.error_message);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setBackendError("Server is down or unreachable.");
    }

    setIsLoading(false);
    stopLoadingMessages();
  };

  const checkHealth = async () => {
    setHealthError("");
    setHealthData(null);
    setHealthOpen(true);
    try {
      const res = await fetch("http://localhost:5000/health");
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      setHealthError("Health check failed. Server unreachable.");
    }
  };

  const closeHealthModal = () => setHealthOpen(false);

  return (
    <div className="text-white max-w-4xl mx-auto pt-20 relative">
      {/* Loading overlay with messages */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-300 text-lg font-semibold">{loadingMessage}</p>
        </div>
      )}

      <h1 className="text-4xl mb-6 font-bold text-center text-purple-300">
        Brand Reputation Guard Agent
      </h1>

      {/* Health Check Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={checkHealth}
          className="bg-green-600 hover:bg-green-700 transition-all text-white font-semibold px-6 py-2 rounded-lg"
        >
          Check Health
        </button>
      </div>

      {/* Form */}
      <div className="bg-[#0a0a0a] p-7 rounded-xl border border-gray-700 shadow-lg">
        <InputField
          label="Brand Name"
          value={brand}
          setValue={setBrand}
          placeholder="e.g., Tesla"
        />
        <InputField
          label="Type"
          value={type}
          setValue={setType}
          placeholder="webservice"
        />

        <DatePickerInput
          label="Start Date"
          selectedDate={startDate}
          setSelectedDate={setStartDate}
        />
        <DatePickerInput
          label="End Date"
          selectedDate={endDate}
          setSelectedDate={setEndDate}
        />

        <InputField
          label="Sources (comma separated)"
          value={sources}
          setValue={setSources}
          placeholder="Twitter, NewsAPI"
        />

        {error && (
          <p className="text-red-400 mt-2 text-center font-semibold">{error}</p>
        )}

        <button
          onClick={analyzeBrand}
          disabled={isLoading}
          className={`w-full mt-4 p-3 rounded-lg ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } transition-all`}
        >
          {isLoading ? "Analyzing..." : "Analyze Brand"}
        </button>
      </div>

      {/* Result/Error Card */}
      <div ref={resultRef} className="mt-10 space-y-6">
        {backendError && (
          <div className="bg-[#111] p-6 rounded-xl border border-red-600 shadow-lg">
            <h2 className="text-xl font-bold text-red-400">Error</h2>
            <p className="text-gray-300 mt-2">{backendError}</p>
          </div>
        )}

        {result && (
          <div className="bg-[#111] p-6 rounded-xl border border-gray-700 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-purple-300">
              {result.brand_name} — Status:{" "}
              <span
                className={`font-semibold ${
                  result.status === "Good"
                    ? "text-green-400"
                    : result.status === "Warning"
                    ? "text-yellow-400"
                    : "text-red-500"
                }`}
              >
                {result.status}
              </span>
            </h2>

            {/* Mentions / Suspicious / Top Sources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#222] p-4 rounded-lg border border-gray-600 text-center">
                <p className="text-gray-300">Mentions Detected</p>
                <p className="text-xl font-bold">{result.mentions_detected}</p>
              </div>
              <div className="bg-[#222] p-4 rounded-lg border border-gray-600 text-center">
                <p className="text-gray-300">Suspicious Posts</p>
                <p className="text-xl font-bold">{result.suspicious_posts}</p>
              </div>
              <div className="bg-[#222] p-4 rounded-lg border border-gray-600 text-center">
                <p className="text-gray-300">Top Sources</p>
                <ul className="text-sm text-purple-300 mt-1 space-y-1">
                  {result.top_sources.map((src, idx) => (
                    <li key={idx}>
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-purple-400 break-all"
                      >
                        {src}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#222] p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                Summary
              </h3>
              <p className="text-gray-300">{result.summary}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-[#222] p-4 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                Recommendation
              </h3>
              <p className="text-gray-300">{result.recommendation}</p>
            </div>

            {/* Fake News */}
            {result.fake_news_Reallife?.length > 0 && (
              <div className="bg-[#222] p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">
                  Detected Fake News
                </h3>
                <div className="space-y-3">
                  {result.fake_news_Reallife.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111] p-3 rounded-lg border border-gray-700"
                    >
                      <p className="text-gray-300 font-semibold">
                        {item.source} — {item.severity} ({item.confidence * 100}%)
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        {item.content_snippet}
                      </p>
                      <a
                        href={item.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 underline text-sm mt-1 block break-all"
                      >
                        {item.Link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Health Modal */}
      {healthOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={closeHealthModal}
        >
          <div
            className="bg-[#111] p-6 rounded-xl border border-gray-700 shadow-lg relative w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400"
              onClick={closeHealthModal}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-purple-300 mb-4">Server Health</h2>
            {healthError && <p className="text-red-400">{healthError}</p>}
            {healthData && (
              <div className="text-gray-300">
                <p>Status: <span className="font-semibold text-green-400">{healthData.status}</span></p>
                <p>Timestamp: {new Date(healthData.timestamp).toLocaleString()}</p>
              </div>
            )}
            {!healthData && !healthError && <p className="text-gray-300">Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
