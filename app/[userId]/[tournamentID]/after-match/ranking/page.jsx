import { getUserDesignRegistry } from "@/themes/registry";

export default async function AfterMatchRanking({ params, searchParams }) {
  const { userId, tournamentID } = await params;
  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams?.preview === "1";
  const { AfterMatchScore: View } = await getUserDesignRegistry(
    userId,
    tournamentID,
  );
  return <View tournamentID={tournamentID} preview={preview} />;
}
