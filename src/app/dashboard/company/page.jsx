'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";

// Helper to format date for input[type=date]
const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split('T')[0];
};

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ name: "", logo: "", ntn: "", address: "", contact: "", email: "", fiscalStart: "", fiscalEnd: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const res = await fetch("/api/company");
        const data = await res.json();
        if (data) {
          setCompany(data);
          setForm({
            name: data.name || "",
            logo: data.logo || "",
            ntn: data.ntn || "",
            address: data.address || "",
            contact: data.contact || "",
            email: data.email || "",
            fiscalStart: formatDateForInput(data.fiscalStart),
            fiscalEnd: formatDateForInput(data.fiscalEnd),
          });
        }
      } catch (err) { console.error(err); }
    };
    loadCompanyData();
  }, []);

  async function save() {
    try {
      setStatus("saving");
      const res = await axios.post("/api/company", form);
      setStatus("saved");
      setCompany(res.data);
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Details</h1>
      <div className="bg-white shadow rounded p-4 max-w-2xl">
        <label className="block mb-2">Name</label>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block mb-2">NTN</label>
        <input value={form.ntn} onChange={e => setForm({...form, ntn: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block mb-2">Address</label>
        <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block mb-2">Contact</label>
        <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block mb-2">Email</label>
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block mb-2">Fiscal Year Start</label>
            <input type="date" value={form.fiscalStart} onChange={e => setForm({...form, fiscalStart: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-2">Fiscal Year End</label>
            <input type="date" value={form.fiscalEnd} onChange={e => setForm({...form, fiscalEnd: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          {status === "saving" && <span>Saving...</span>}
        </div>
      </div>
    </div>
  );
}