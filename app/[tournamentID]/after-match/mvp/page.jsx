import { getDesignRegistry } from "@/lib/design/registry";

export default async function MVP({ params }) {
  const { tournamentID } = await params;
  const { MVP: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
