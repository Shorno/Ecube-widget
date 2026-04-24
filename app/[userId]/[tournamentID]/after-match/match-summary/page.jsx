import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function MatchSummary({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { MatchSummary: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
