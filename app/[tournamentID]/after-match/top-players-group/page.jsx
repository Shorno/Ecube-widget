import { getDesignRegistry } from "@/lib/design/registry";

export default async function TopPlayersGroup({ params }) {
  const { tournamentID } = await params;
  const { TopPlayersGroup: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
