import { getDesignRegistry } from "@/lib/design/registry";

export default async function MatchSummary({ params }) {
  const { tournamentID } = await params;
  const { MatchSummary: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
