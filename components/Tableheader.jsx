import { cn } from "@/lib/utils";

const Tableheader = ({
  overall = false,
  showMatchPlayed = false,
  mythical = false,
}) => {
  return (
    <div className={cn("from-primary-shade-two to-primary flex w-215 bg-linear-to-b p-2 text-center text-lg font-bold text-black uppercase", mythical && "text-white bg-linear-to-r  from-[#00B194] to-[#00473C]")}>
      <div className="w-15! text-start uppercase">ranK</div>
      <div className="w-full uppercase">Team name</div>

      <div className="flex">
        {/* {showMatchPlayed && (
          <div className="w-[80.67px]">Matches</div>
        )} */}

        {overall && (
          <>
            {/* <div className="w-[80.67px]">Matches</div> */}
            <div className="w-[120.67px]">WWCD</div>
          </>
        )}
        <div className="w-[120.67px]">POS PTS</div>
        <div className="w-[120.67px]">Elims</div>
        <div className="w-[120.67px] pl-3">Total</div>
      </div>
    </div>
  );
};

export default Tableheader;
