import { getUserDesignRegistry } from "@/themes/registry";

export default async function WWC({ params }) {
  const { userId, tournamentID } = await params;
  const { WWC: View } = await getUserDesignRegistry(userId, tournamentID);
  return <View tournamentID={tournamentID} />;
}
