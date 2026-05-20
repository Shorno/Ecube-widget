import { getUserDesignRegistry } from "@/themes/registry";

export default async function MVPGroup({ params }) {
  const { userId, tournamentID } = await params;
  const { MVPGroup: View } = await getUserDesignRegistry(userId, tournamentID);
  return <View tournamentID={tournamentID} />;
}
