import { getDesignRegistry } from "@/lib/design/registry";

export default async function WWCTwo({ params }) {
  const { tournamentID } = await params;
  const { WWCTwo: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
