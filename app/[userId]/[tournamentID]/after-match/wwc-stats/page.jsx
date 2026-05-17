import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function WWCStats({ params }) {
  const { userId, tournamentID } = await params;
  const { WWCStats: View } = await getUserDesignRegistry(userId, tournamentID);
  return <View tournamentID={tournamentID} />;
}
