import { getDesignRegistry } from "@/lib/design/registry";

export default async function HeadToHead({ params }) {
  const { tournamentID } = await params;
  const { HeadToHead: View } = await getDesignRegistry("default");
  return <View tournamentID={tournamentID} />;
}
