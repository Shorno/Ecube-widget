import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function WWC({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { WWC: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
