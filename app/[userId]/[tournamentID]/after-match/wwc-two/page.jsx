import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function WWCTwo({ params }) {
  const { userId, tournamentID } = await params;
  const { WWCTwo: View } = await getUserDesignRegistry(userId, tournamentID);
  return <View tournamentID={tournamentID} />;
}
