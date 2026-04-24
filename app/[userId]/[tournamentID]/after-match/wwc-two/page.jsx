import { getUserDesign } from "@/lib/design/get-user-design";
import { getDesignRegistry } from "@/lib/design/registry";

export default async function WWCTwo({ params }) {
  const { userId, tournamentID } = await params;
  const variant = await getUserDesign(userId);
  const { WWCTwo: View } = getDesignRegistry(variant);
  return <View tournamentID={tournamentID} />;
}
