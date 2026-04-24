// Design registry — maps variant names to their widget component sets.
//
// Each variant must export all slots listed below.
// Adding a new design = create components/designs/<variant>/ with the same exports,
// then register it here. Zero changes required in page files.
//
// Slot names are the canonical identifiers used by widget pages.

import AfterMatchScoreView    from "@/components/designs/default/AfterMatchScoreView";
import AfterMatchScoreGroupView from "@/components/designs/default/AfterMatchScoreGroupView";
import MatchSummaryView       from "@/components/designs/default/MatchSummaryView";
import MVPView                from "@/components/designs/default/MVPView";
import MVPGroupView           from "@/components/designs/default/MVPGroupView";
import HeadToHeadView         from "@/components/designs/default/HeadToHeadView";
import TopPlayersView         from "@/components/designs/default/TopPlayersView";
import TopPlayersGroupView    from "@/components/designs/default/TopPlayersGroupView";
import WWCView                from "@/components/designs/default/WWCView";
import WWCTwoView             from "@/components/designs/default/WWCTwoView";
import WWCStatsView           from "@/components/designs/default/WWCStatsView";

const defaultDesign = {
  AfterMatchScore:      AfterMatchScoreView,
  AfterMatchScoreGroup: AfterMatchScoreGroupView,
  MatchSummary:         MatchSummaryView,
  MVP:                  MVPView,
  MVPGroup:             MVPGroupView,
  HeadToHead:           HeadToHeadView,
  TopPlayers:           TopPlayersView,
  TopPlayersGroup:      TopPlayersGroupView,
  WWC:                  WWCView,
  WWCTwo:               WWCTwoView,
  WWCStats:             WWCStatsView,
};

// To add a new design:
//   1. Create components/designs/<variant>/ with the same component files
//   2. Import them above and add an entry to REGISTRY below
const REGISTRY = {
  default:  defaultDesign,
  mythical: defaultDesign, // placeholder — replace with mythical components when ready
};

export function getDesignRegistry(variant) {
  return REGISTRY[variant] ?? REGISTRY.default;
}
