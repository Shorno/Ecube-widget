import { getDesignRegistry } from "@/lib/design/registry";

export default async function TopPlayers({ params }) {
  const { tournamentID } = await params;
  const { TopPlayers: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
