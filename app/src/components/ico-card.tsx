import {
  ArrowDown as DownvotesIcon,
  ArrowUp as UpvotesIcon,
  Calendar as DateIcon,
  CircleDashed as NoImageIcon,
  CircleDollarSign as FundsIcon,
  Flame as ReputationIcon,
  MessageCircleMore as CommentsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type IcoCardProps = {
  sale: `0x${string}`;
  name: string;
  symbol: string;
  imageURI: string;
  totalRaised: bigint;
  end: number;
  description?: string;
  reputationScore?: number;
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
};
export function IcoCard({
  sale,
  name,
  symbol,
  totalRaised,
  end,
  description,
}: IcoCardProps) {
  console.log("total", totalRaised)
  if (totalRaised > BigInt(Number.MAX_SAFE_INTEGER)) {
    console.warn("totalRaised is too large, may lose precision");
  }


  function extractStorageKey(description: string): string | null {
    console.log(description, "description");
    const match = description.match(/\+\s*([a-fA-F0-9]+)/);
    console.log(match, "match");
    return match ? match[1] : null;
  }

  
function storageKeyToGroveUrl(storageKey: string) {
return `https://api.grove.storage/${storageKey}`;
}

const imageStorageKey = description
? extractStorageKey(description as string)
: null;
const imageURI = imageStorageKey
? storageKeyToGroveUrl(imageStorageKey)
: undefined;

  const raised = formatBigNumber(Number(totalRaised) / 1e18, 1);
  return (
    <Link href={`/sale/${sale}`}>
      <div className="h-72 flex flex-col justify-between relative border border-border p-4 hover:border-primary/20 transition-colors group break-words">
        <div>
          <h2 className="text-lg font-semibold pb-2 uppercase group-hover:text-primary tracking-tight truncate">
            {name} ({symbol})
          </h2>
          <div className="flex justify-between">
            <div className="p-[2px] bg-foreground w-fit">
              {imageURI ? (
                <Image
                  src={imageURI}
                  alt={`Image of ${name}`}
                  width={56}
                  height={56}
                  className="aspect-square"
                />
              ) : (
                <div className="size-[56px] aspect-square bg-secondary flex justify-center items-center">
                  <NoImageIcon className="size-10" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center pt-2">
            <FundsIcon className="size-5 mr-2" />
            <span className="text-xs uppercase">
              funds<span className="text-primary font-bold">_</span>raised:{" "}
              <span className="font-mono text-sm">
                {raised} GHO
              </span>
            </span>
          </div>
          <div className="flex items-center pt-2">
            <DateIcon className="size-5 mr-2" />
            <span className="text-xs uppercase">
              end<span className="text-primary font-bold">_</span>date:{" "}
              {formatUnixTimeToLocale(BigInt(end))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}



const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  // second: "2-digit",
};

function formatUnixTimeToLocale(time: bigint) {
  return new Date(Number(time) * 1000).toLocaleString(
    undefined,
    dateFormatOptions,
  );
}

function formatBigNumber(num: number, digits: number): string;
function formatBigNumber(num: bigint, digits: number): string;
function formatBigNumber(num: number | bigint, digits: number) {
  // NOTE: assuming the values are within safe number range
  const normalizedNum = typeof num === "bigint" ? Number(num) : num;

  if (normalizedNum >= 1_000_000_000_000) {
    return `${
      (normalizedNum / 1_000_000_000_000).toFixed(digits).replace(/\.0$/, "")
    }T`;
  }
  if (normalizedNum >= 1_000_000_000) {
    return `${
      (normalizedNum / 1_000_000_000).toFixed(digits).replace(/\.0$/, "")
    }B`;
  }
  if (normalizedNum >= 1_000_000) {
    return `${
      (normalizedNum / 1_000_000).toFixed(digits).replace(/\.0$/, "")
    }M`;
  }
  if (normalizedNum >= 1_000) {
    return `${(normalizedNum / 1_000).toFixed(digits).replace(/\.0$/, "")}k`;
  }
  return normalizedNum.toString();
}

export const Corner = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
