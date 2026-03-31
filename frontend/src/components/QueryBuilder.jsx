import React, { useState, useEffect, useRef } from "react";
import AccuracySlider from "./AccuracySlider";
import ResultsComparison from "./ResultsComparison";
import { runCompareQuery, getDataInfo, uploadDataset, resetDataset } from "../utils/api";

/**
 * QueryBuilder
 * -------------
 * Overhauled to match the Figma FigmaDesign Mockup.
 * Features rounded pill segments, large action buttons, 
 * and the cyberpunk deep purple color palette.
 */

const QUERY_TYPES = [
  { value: "count", label: "COUNT" },
  { value: "count_distinct", label: "COUNT DISTINCT" },
  { value: "sum", label: "SUM" },
  { value: "avg", label: "AVG" },
  { value: "group_by", label: "GROUP BY" },
];

const AGG_FUNCS = ["AVG", "SUM", "COUNT"];

export default function QueryBuilder() {
  const [queryType, setQueryType] = useState("count");
  const [column, setColumn] = useState("*");
  const [whereClause, setWhereClause] = useState("");
  const [groupByColumn, setGroupByColumn] = useState("");
  const [aggFunc, setAggFunc] = useState("AVG");
  const [accuracy, setAccuracy] = useState(0.95);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Dynamic Dataset Schema State
  const [allCols, setAllCols] = useState([]);
  const [numericCols, setNumericCols] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const info = await getDataInfo();
      setDatasetInfo(info);
      if (info && info.columns) {
        const colNames = info.columns.map((c) => c.name);
        const numColNames = info.columns
          .filter((c) => /INT|DOUBLE|FLOAT|DECIMAL|NUMERIC/.test(c.type.toUpperCase()))
          .map((c) => c.name);
        setAllCols(colNames);
        setNumericCols(numColNames.length ? numColNames : colNames);
        if (colNames.length > 0 && !column) {
            setColumn(colNames[0]);
            setGroupByColumn(colNames[0]);
        }
      }
    } catch (err) {
      console.error("Schema fetch failed", err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      await uploadDataset(file);
      await fetchSchema();
      alert(`Successfully loaded ${file.name}!`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload dataset.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReset = async () => {
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      await resetDataset();
      await fetchSchema();
    } catch (err) {
      setError("Failed to reset dataset.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = {
        query_type: queryType,
        column: queryType === "count" ? "*" : column,
        where: whereClause || null,
        group_by_column: queryType === "group_by" ? groupByColumn : null,
        agg_func: queryType === "group_by" ? aggFunc : "AVG",
        accuracy_target: accuracy,
      };
      const data = await runCompareQuery(params);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to run query");
    } finally {
      setLoading(false);
    }
  };

  const getSqlPreview = () => {
    let sql = "SELECT ";
    const cSafe = column === "*" ? "*" : `"${column}"`;
    const gSafe = `"${groupByColumn}"`;
    switch (queryType) {
      case "count": sql += "COUNT(*)"; break;
      case "count_distinct": sql += `COUNT(DISTINCT ${cSafe})`; break;
      case "sum": sql += `SUM(${cSafe})`; break;
      case "avg": sql += `AVG(${cSafe})`; break;
      case "group_by": sql += `${gSafe}, ${aggFunc}(${cSafe})`; break;
    }
    sql += " FROM transactions";
    if (whereClause) sql += ` WHERE ${whereClause}`;
    if (queryType === "group_by") sql += ` GROUP BY ${gSafe}`;
    return sql;
  };

  return (
    <div className="space-y-8 animate-in mt-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="section-title-dino">QUERY ENGINE</h1>
          <p className="text-white/60 tracking-wider text-sm mt-3 font-sans">
            Run SQL-like analytical queries and compare exact vs approximate results side-by-side
          </p>
        </div>
        
        {/* Upload Button */}
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv,.parquet" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="px-6 py-3 bg-white text-black font-black text-xs rounded-full uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload CSV File
          </button>
          
          <button 
            onClick={handleReset}
            className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/40"
            title="Reset to sample data"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Query Card */}
        <div className="lg:col-span-2 neo-card p-10 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Query Type selection - Pill Toggles */}
            <div className="space-y-4">
              <label className="neo-label ml-2">Query Type</label>
              <div className="pill-segmented-container">
                {QUERY_TYPES.map((qt) => (
                  <button
                    key={qt.value}
                    type="button"
                    onClick={() => setQueryType(qt.value)}
                    className={`pill-toggle ${
                      queryType === qt.value ? "pill-toggle-active" : "pill-toggle-inactive"
                    }`}
                  >
                    {qt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column selection */}
            {queryType !== "count" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="neo-label ml-2">Column</label>
                  <select
                    value={column}
                    onChange={(e) => setColumn(e.target.value)}
                    className="input-field-neo"
                  >
                    {(queryType === "count_distinct" ? allCols : numericCols).map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {queryType === "group_by" && (
                  <>
                    <div className="space-y-4">
                      <label className="neo-label ml-2">Group By</label>
                      <select
                        value={groupByColumn}
                        onChange={(e) => setGroupByColumn(e.target.value)}
                        className="input-field-neo"
                      >
                        {allCols.map((col) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="neo-label ml-2">Aggregation</label>
                      <select
                        value={aggFunc}
                        onChange={(e) => setAggFunc(e.target.value)}
                        className="input-field-neo"
                      >
                        {AGG_FUNCS.map((fn) => (
                          <option key={fn} value={fn}>{fn}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* WHERE Clause */}
            <div className="space-y-4">
              <label className="neo-label ml-2">WHERE Clause (optional)</label>
              <input
                type="text"
                value={whereClause}
                onChange={(e) => setWhereClause(e.target.value)}
                placeholder="e.g. region = 'North' or amount > 100"
                className="input-field-neo"
              />
            </div>

            {/* SQL Preview */}
            <div className="bg-black/30 rounded-[30px] p-6 border border-white/5">
              <p className="neo-label mb-3">SQL PREVIEW</p>
              <code className="text-sm font-mono text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]">
                {getSqlPreview()}
              </code>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-white-pill"
            >
              {loading ? <span className="animate-pulse">Processing...</span> : "Run Query"}
            </button>
          </form>
        </div>

        {/* Sidebar - Accuracy Control */}
        <div className="space-y-8">
          <AccuracySlider value={accuracy} onChange={setAccuracy} />
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="neo-card p-6 border-neon-pink/20 bg-neon-pink/5">
          <p className="text-neon-pink font-bold text-sm tracking-widest uppercase">❌ {error}</p>
        </div>
      )}

      {result && <ResultsComparison data={result} />}
    </div>
  );
}
