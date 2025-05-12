import { type OffChainICO } from "@/dummy-data";
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

type IcoCardProps = OffChainICO;

export function IcoCard({
  id,
  title,
  slug,
  description,
  logoUrl,
  team,
  reputationScore,
  upvotes,
  downvotes,
  commentsCount,
  createdAt,
  updatedAt,
  tokenAddress,
  startTime,
  endTime,
  fundsRaised,
  status,
}: IcoCardProps) {
  return (
    <Link href={id}>
      <div className="h-72 flex flex-col justify-between relative border border-border p-4 hover:border-primary/20 transition-colors group break-words">
        {/* <Corner className="absolute size-4 -top-2 -left-2 text-muted-foreground dark:text-primary-foreground group-hover:text-primary" /> */}
        {/* <Corner className="absolute size-4 -bottom-2 -left-2 text-muted-foreground dark:text-primary-foreground group-hover:text-primary" /> */}
        {/* <Corner className="absolute size-4 -top-2 -right-2 text-muted-foreground dark:text-primary-foreground group-hover:text-primary" /> */}
        {/* <Corner className="absolute size-4 -bottom-2 -right-2 text-muted-foreground dark:text-primary-foreground group-hover:text-primary" /> */}
        <div>
          <h2 className="text-lg font-semibold pb-2 uppercase group-hover:text-primary tracking-tight truncate">
            {title}
          </h2>
          <div className="flex justify-between">
            <div className="p-[2px] bg-foreground w-fit">
              {logoUrl
                ? (
                  <Image
                    src={logoUrl}
                    alt={`Image of ${title}`}
                    width={56}
                    height={56}
                    className="aspect-square"
                  />
                )
                : (
                  <div className="size-[56px] aspect-square bg-secondary flex justify-center items-center">
                    <NoImageIcon className="size-10" />
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2">
              <span className="flex justify-end items-center pl-3">
                <span className="font-mono text-sm pr-1">
                  {formatBigNumber(reputationScore, 1)}
                </span>
                <ReputationIcon className="size-5" />
              </span>
              <span className="flex justify-end items-center pl-3">
                <span className="font-mono text-sm pr-1">
                  {formatBigNumber(upvotes, 1)}
                </span>
                <UpvotesIcon className="size-5" />
              </span>
              <span className="flex justify-end items-center pl-3">
                <span className="font-mono text-sm pr-1">
                  {formatBigNumber(commentsCount, 1)}
                </span>
                <CommentsIcon className="size-5" />
              </span>
              <span className="flex justify-end items-center pl-3">
                <span className="font-mono text-sm pr-1">
                  {formatBigNumber(downvotes, 1)}
                </span>
                <DownvotesIcon className="size-5" />
              </span>
            </div>
          </div>
          <p className="text-muted-foreground py-3 line-clamp-3 text-sm">
            {description || "..."}
          </p>
        </div>

        <div className="mt-4">
          {/* <span className="text-sm uppercase text-primary hover:underline"> */}
          {/*   → */}
          {/* </span> */}
          <div className="flex items-center pt-2">
            <FundsIcon className="size-5 mr-2" />
            <span className="text-xs uppercase">
              funds<span className="text-primary font-bold">_</span>raised:{" "}
              <span className="font-mono text-sm">
                {formatBigNumber(fundsRaised, 1)}
              </span>
            </span>
          </div>
          <div className="flex items-center pt-2">
            <DateIcon className="size-5 mr-2" />
            <span className="text-xs uppercase">
              end<span className="text-primary font-bold">_</span>date:{" "}
              {formatUnixTimeToLocale(endTime)}
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
