import { connectDB } from "@/lib/db/mongoose";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import DesignsPanel from "../_components/DesignsPanel";
import RegisterDesignsButton from "../_components/RegisterDesignsButton";
import Link from "next/link";

export default async function AdminDesignsPage() {
  await connectDB();
  const designs = await DesignRegistry.find({}).sort({ createdAt: 1 }).lean();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Design Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage design bundles and access control.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RegisterDesignsButton />
          <Link
            href="/admin"
            className="rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </div>
      <DesignsPanel initialDesigns={designs} />
    </div>
  );
}
