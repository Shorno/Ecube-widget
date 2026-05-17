import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import DesignRegistry from "@/lib/db/models/DesignRegistry";
import EditUserForm from "./_components/EditUserForm";

export default async function EditUserPage({ params }) {
  const { userId } = await params;
  await connectDB();

  const [user, designs] = await Promise.all([
    User.findById(userId, { passwordHash: 0 }).lean(),
    DesignRegistry.find({ active: true }).sort({ isExclusive: 1, label: 1 }).lean(),
  ]);

  if (!user) notFound();

  const availableDesigns = designs.filter(
    (d) => !d.isExclusive || d.assignedTo.includes(userId),
  );

  // Serialize Date objects → ISO strings so Client Component receives plain JSON
  const safeUser = {
    ...user,
    subscriptionExpiry: user.subscriptionExpiry?.toISOString() ?? null,
    createdAt:          user.createdAt?.toISOString()          ?? null,
    updatedAt:          user.updatedAt?.toISOString()          ?? null,
  };

  return <EditUserForm user={safeUser} designs={availableDesigns} />;
}
