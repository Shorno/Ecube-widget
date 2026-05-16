import { getDesignRegistry } from "@/lib/design/registry";

export default async function AfterMatchScoreGroup({ params }) {
  const { tournamentID } = await params;
  const { AfterMatchScoreGroup: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
