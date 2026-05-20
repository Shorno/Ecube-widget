import { getUserDesignRegistry } from "@/themes/registry";

export default async function TopPlayers({ params }) {
  const { userId, tournamentID } = await params;
  const { TopPlayers: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
