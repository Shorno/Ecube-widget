import { getUserDesignRegistry } from "@/themes/registry";

export default async function AfterMatchRanking({ params }) {
  const { userId, tournamentID } = await params;
  const { AfterMatchScore: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
