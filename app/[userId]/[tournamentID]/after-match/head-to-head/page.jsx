import { getUserDesignRegistry } from "@/lib/design/registry";

export default async function HeadToHead({ params }) {
  const { userId, tournamentID } = await params;
  const { HeadToHead: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} />;
}
