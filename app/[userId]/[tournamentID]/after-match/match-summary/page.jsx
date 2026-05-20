import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function MatchSummary({ params }) {
  const { userId, tournamentID } = await params;
  const { MatchSummary: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
