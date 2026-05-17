import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function MVP({ params }) {
  const { userId, tournamentID } = await params;
  const { MVP: View } = await getUserDesignRegistry(userId, tournamentID);
  return <View tournamentID={tournamentID} />;
}
