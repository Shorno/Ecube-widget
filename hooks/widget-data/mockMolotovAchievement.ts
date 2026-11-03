import type { MolotovPayload } from "@/types/molotov";
import { getMockGrenadierAchievement } from "./mockGrenadierAchievement";

// Same sample kill as the Grenadier preview, thrown with a molotov instead.
export function getMockMolotovAchievement(): MolotovPayload {
  return {
    ...getMockGrenadierAchievement(),
    weapon: {
      id: "602003",
      name: "Molotov Cocktail",
      type: "molotov",
    },
  };
}
