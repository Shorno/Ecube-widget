import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function AfterMatchScoreGroup({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { AfterMatchScoreGroup: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
