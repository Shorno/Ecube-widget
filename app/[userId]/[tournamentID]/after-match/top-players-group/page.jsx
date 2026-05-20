import { getUserDesignRegistry } from "@/themes/registry";

export default async function TopPlayersGroup({ params }) {
  const { userId, tournamentID } = await params;
  const { TopPlayersGroup: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
