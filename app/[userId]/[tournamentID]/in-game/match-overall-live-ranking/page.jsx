import { getUser } from "@/lib/db/queries";
import { getUserDesignRegistry } from "@/themes/registry";

export default async function MatchOverallLiveRanking({ params, searchParams }) {
  const { userId, tournamentID } = await params;
  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams?.preview === "1";
  const user = await getUser(userId);
  const showTeamFlags = user?.themeConfig?.showTeamFlags !== false;
  const { LiveOverallRanking: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return (
    <View
      tournamentID={tournamentID}
      showTeamFlags={showTeamFlags}
      preview={preview}
    />
  );
}
