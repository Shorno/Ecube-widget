import { getUser } from "@/lib/db/queries";
import { getUserDesignRegistry } from "@/themes/registry";

export default async function RecallPage({ params, searchParams }) {
  const { userId, tournamentID } = await params;
  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams?.preview === "1";
  const user = await getUser(userId);
  const showFullTeamName = user?.themeConfig?.showFullTeamName === true;
  const { TeamRecall: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return (
    <View
      tournamentID={tournamentID}
      preview={preview}
      showFullTeamName={showFullTeamName}
    />
  );
}
