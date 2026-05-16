import { getDesignRegistry } from "@/lib/design/registry";

export default async function MVPGroup({ params }) {
  const { tournamentID } = await params;
  const { MVPGroup: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
