import { getDesignRegistry } from "@/lib/design/registry";

export default async function WWCStats({ params }) {
  const { tournamentID } = await params;
  const { WWCStats: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
