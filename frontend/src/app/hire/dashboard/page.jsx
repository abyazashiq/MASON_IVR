"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HireDashboard() {
  const searchParams = useSearchParams();
  const empId = searchParams.get("emp_id");

  const [employer, setEmployer] = useState(null);
  const [masons, setMasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!empId) return;

    const fetchDashboard = async () => {
      try {
        // Fetch employer profile
        const empRes = await fetch(`http://127.0.0.1:8000/employer/${empId}`);
        const empData = await empRes.json();

        // Fetch masons
        const masonRes = await fetch(`http://127.0.0.1:8000/employer/${empId}/masons`);
        const masonData = await masonRes.json();

        setEmployer({
          name: empData?.name || "Unknown",
          email: empData?.email || "Unknown",
        });

        setMasons(masonData?.masons || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [empId]);

  const updateStatus = (id, status) => {
    fetch(`http://127.0.0.1:8000/masons/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_status: status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.updated) {
          alert("Contact status updated!");
          setMasons(
            masons.map((m) => (m.id === id ? { ...m, contact_status: status } : m))
          );
        } else {
          alert("Failed to update status.");
        }
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Error updating status.");
      });
  };

  if (!empId) return <p className="text-red-500">Error: employer ID missing in URL.</p>;
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>

      {employer && (
        <div className="mb-6 p-4 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold">Welcome, {employer.name}</h2>
          <p>Email: {employer.email}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3">Mason Table</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Number</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Pay</th>
            <th className="border p-2">Contact Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {masons.length > 0 ? (
            masons.map((mason) => (
              <tr key={mason.id} className="hover:bg-gray-50">
                <td className="border p-2">{mason.name}</td>
                <td className="border p-2">{mason.number}</td>
                <td className="border p-2">{mason.address}</td>
                <td className="border p-2">{mason.pay}</td>
                <td className="border p-2">{mason.contact_status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => updateStatus(mason.id, "Contacted")}
                  >
                    Mark Contacted
                  </button>
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => updateStatus(mason.id, "Not Contacted")}
                  >
                    Mark Not Contacted
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No masons available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
