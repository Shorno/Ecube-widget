import { getUserDesignRegistry } from "@/themes/registry";

export default async function AfterMatchScoreGroup({ params }) {
  const { userId, tournamentID } = await params;
  const { AfterMatchScoreGroup: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
