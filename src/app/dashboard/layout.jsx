import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
