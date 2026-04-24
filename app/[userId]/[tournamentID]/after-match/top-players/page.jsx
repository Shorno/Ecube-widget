import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function TopPlayers({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { TopPlayers: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
