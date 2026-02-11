"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const empId = searchParams.get("emp_id");

  const [employer, setEmployer] = useState(null);
  const [masons, setMasons] = useState([]);
  const [filteredMasons, setFilteredMasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Column-specific filters
  const [filters, setFilters] = useState({
    name: "",
    number: "",
    address: "",
    pay: "",
    contact_status: "All",
  });

  useEffect(() => {
    if (!empId) return;

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

    const fetchDashboard = async () => {
      try {
        const empRes = await fetch(`${BACKEND_URL}/employer/${empId}`);
        const empData = await empRes.json();

        const masonRes = await fetch(`${BACKEND_URL}/employer/${empId}/masons`);
        const masonData = await masonRes.json();

        setEmployer({
          name: empData?.name || "Unknown",
          email: empData?.email || "Unknown",
        });

        setMasons(masonData?.masons || []);
        setFilteredMasons(masonData?.masons || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [empId]);
useEffect(() => {
  let filtered = masons;

  if (filters.name) {
    const term = filters.name.toLowerCase();
    filtered = filtered.filter(m => (m.name ?? "").toLowerCase().includes(term));
  }
  if (filters.number) {
    const term = filters.number.toLowerCase();
    filtered = filtered.filter(m => (m.number ?? "").toLowerCase().includes(term));
  }
  if (filters.address) {
    const term = filters.address.toLowerCase();
    filtered = filtered.filter(m => (m.address ?? "").toLowerCase().includes(term));
  }
  if (filters.pay) {
    filtered = filtered.filter(m => (m.pay ?? "").toString().includes(filters.pay));
  }
  if (filters.contact_status !== "All") {
    filtered = filtered.filter(m => m.contact_status === filters.contact_status);
  }

  setFilteredMasons(filtered);
}, [filters, masons]);

  const updateStatus = (id, status) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    fetch(`${BACKEND_URL}/masons/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_status: status }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.updated) {
          setMasons(
            masons.map(m => (m.id === id ? { ...m, contact_status: status } : m))
          );
        } else {
          alert("Failed to update status.");
        }
      })
      .catch(err => {
        console.error("Error updating status:", err);
        alert("Error updating status.");
      });
  };

  if (!empId) return <p className="text-red-500 text-center mt-10">Error: employer ID missing in URL.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-700">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100">
      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50 border-b border-white/30">
        <h1 className="text-2xl font-bold text-gray-800">Mason Hire Dashboard</h1>
        {employer && (
          <div className="text-right">
            <p className="font-semibold text-gray-700">{employer.name}</p>
            <p className="text-gray-500 text-sm">{employer.email}</p>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Mason Table */}
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md shadow-lg border border-white/30 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mason Table</h2>

          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-gray-200">
                {["Name","Number","Address","Pay","Contact Status","Actions"].map((h) => (
                  <th key={h} className="border p-3 text-left">{h}</th>
                ))}
              </tr>
              {/* Column Filters */}
              <tr className="bg-gray-100">
                <th className="border p-2">
                  <input
                    type="text"
                    placeholder="Search Name"
                    className="w-full p-1 border rounded"
                    value={filters.name}
                    onChange={e => setFilters({ ...filters, name: e.target.value })}
                  />
                </th>
                <th className="border p-2">
                  <input
                    type="text"
                    placeholder="Search Number"
                    className="w-full p-1 border rounded"
                    value={filters.number}
                    onChange={e => setFilters({ ...filters, number: e.target.value })}
                  />
                </th>
                <th className="border p-2">
                  <input
                    type="text"
                    placeholder="Search Address"
                    className="w-full p-1 border rounded"
                    value={filters.address}
                    onChange={e => setFilters({ ...filters, address: e.target.value })}
                  />
                </th>
                <th className="border p-2">
                  <input
                    type="text"
                    placeholder="Search Pay"
                    className="w-full p-1 border rounded"
                    value={filters.pay}
                    onChange={e => setFilters({ ...filters, pay: e.target.value })}
                  />
                </th>
                <th className="border p-2">
                  <select
                    className="w-full p-1 border rounded"
                    value={filters.contact_status}
                    onChange={e => setFilters({ ...filters, contact_status: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Not Contacted">Not Contacted</option>
                  </select>
                </th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMasons.length > 0 ? (
                filteredMasons.map((mason, i) => (
                  <tr
                    key={mason.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                  >
                    <td className="border p-3">{mason.name}</td>
                    <td className="border p-3">{mason.number}</td>
                    <td className="border p-3">{mason.address}</td>
                    <td className="border p-3">{mason.pay}</td>
                    <td className="border p-3">{mason.contact_status}</td>
                    <td className="border p-3 flex gap-2 justify-center">
  <button
    className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition transform hover:scale-105 shadow-sm"
    onClick={() => updateStatus(mason.id, "Contacted")}
  >
    Contacted
  </button>
  <button
    className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition transform hover:scale-105 shadow-sm"
    onClick={() => updateStatus(mason.id, "Not Contacted")}
  >
    Not Contacted
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No masons available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function HireDashboard() {
  return (
    <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
