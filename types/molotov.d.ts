// Molotov-elimination payload from the PLAYER_ELIMINATION socket event,
// surfaced as an achievement only when weapon.type === "molotov". Same shape as
// the grenade payload — only the weapon type differs.

export type { GrenadierPayload as MolotovPayload } from "@/types/grenadier";
