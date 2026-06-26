import { getUserDesignRegistry } from "@/themes/registry";

export default async function MatchStartPage({ params }) {
  const { userId, tournamentID } = await params;
  const { MatchStart: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );

  return <View tournamentID={tournamentID} />;
}
