import { getDesignRegistry } from "@/lib/design/registry";

export default async function AfterMatchScore({ params }) {
  const { tournamentID } = await params;
  const { AfterMatchScore: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
