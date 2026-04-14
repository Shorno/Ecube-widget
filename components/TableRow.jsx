import Image from "next/image";

const TableRow = ({ team, overall = false }) => {
  return (
    <div className="bg-primary flex">
      <div className="bg-primary-shade-two grid min-w-15! place-items-center p-3 text-2xl font-bold text-white">
        #{team?.position}
      </div>
      <div className="flex w-full items-center gap-2 px-2">
        {team?.team_logoUrl && (
          <Image
            src={team.team_logoUrl}
            width={44}
            height={44}
            alt=""
          />
        )}
        <p className="text-2xl font-bold text-black">{team?.team_name}</p>
      </div>
      <div className="bg-primary-shade-two flex items-center p-2 text-center text-xl font-bold">
        {overall && (
          <>
            <div className="w-[80.67px]">{team?.match_played}</div>
            <div className="w-[80.67px]">{team?.wwcd}</div>
          </>
        )}
        <div className="w-[80.67px]">{team?.positionPoints}</div>
        <div className="w-[80.67px]">{team?.killPoints}</div>
        {!overall && <div className="w-[80.67px]">{team?.totalPoints}</div>}
      </div>
      {overall && (
        <div className="flex min-w-[80.67px] items-center p-2 text-xl font-bold text-black">
          <div className="w-full text-center">{team?.totalPoints}</div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
