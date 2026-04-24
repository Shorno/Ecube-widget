import { cn } from "@/lib/utils";
import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";

const TableRow = ({
  team,
  overall = false,
  showMatchPlayed = false,
  className = "",
  mythical = false,
  isLast = false,
}) => {
  return (
    <div className={`bg-primary flex ${className}`}>
      <div
        className={cn(
          "bg-primary-shade-two grid min-w-15! place-items-center p-3 text-3xl font-bold text-white",
          mythical &&
            cn(
              "text-custom-yellow border-custom-yellow border-t border-r border-l",
              isLast && "border-b",
            ),
        )}
      >
        {team?.position}
      </div>
      <div
        className={cn(
          "flex w-full items-center gap-2 bg-white px-2",
          mythical && cn("border-custom-green border-t", isLast && "border-b"),
        )}
      >
        {team?.team_logoUrl && (
          <Image src={team.team_logoUrl} width={44} height={44} alt="" />
        )}
        <p className="flex items-center gap-2 text-[25px] font-bold text-black">
          {team?.team_name}{" "}
          {team?.position == 1 && <GiChickenOven className="text-white" />}
        </p>
      </div>
      <div
        className={cn(
          "bg-primary-shade-two flex items-center p-2 text-center text-3xl font-bold",
          mythical &&
            cn(
              "border-custom-green text-custom-green border-t bg-white",
              isLast && "border-b",
            ),
        )}
      >
        {overall && (
          <>
            {/* <div className="w-[80.67px]">{team?.match_played}</div> */}
            <div className="w-[120.67px]">{team?.wwcd}</div>
          </>
        )}
        {/* {showMatchPlayed && (
          <div className="w-[80.67px]">{team?.match_played}</div>
        )} */}
        <div className="w-[120.67px]">{team?.positionPoints}</div>
        <div className="w-[120.67px]">{team?.killPoints}</div>
        {!overall && <div className="w-[120.67px]">{team?.totalPoints}</div>}
      </div>
      {overall && (
        <div
          className={cn(
            "flex min-w-[120.67px] items-center p-2 text-3xl font-bold text-black",
            mythical &&
              cn(
                "border-custom-yellow border-t border-r border-l bg-linear-to-tl from-[#00B194] to-[#00473C] text-white",
                isLast && "border-b",
              ),
          )}
        >
          <div className="w-full text-center">{team?.totalPoints}</div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
