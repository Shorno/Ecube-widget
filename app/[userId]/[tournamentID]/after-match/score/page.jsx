import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function AfterMatchScore({ params }) {
  const { userId, tournamentID } = await params;
  const { AfterMatchScore: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
