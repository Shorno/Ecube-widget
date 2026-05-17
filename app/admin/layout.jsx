import AdminNav from "./_components/AdminNav";

// Auth is handled by middleware — no async work needed here,
// so loading.jsx skeletons show immediately on navigation.
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white">
      <AdminNav />
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
