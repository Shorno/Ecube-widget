import { getUserDesignRegistry } from "@/themes/registry";

export default async function MapRotation({ params }) {
  const { userId, tournamentID } = await params;
  const { MapRotation: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
