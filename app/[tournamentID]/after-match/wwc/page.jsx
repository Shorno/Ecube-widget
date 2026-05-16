import { getDesignRegistry } from "@/lib/design/registry";

export default async function WWC({ params }) {
  const { tournamentID } = await params;
  const { WWC: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
