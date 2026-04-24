import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function AfterMatchScore({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { AfterMatchScore: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
