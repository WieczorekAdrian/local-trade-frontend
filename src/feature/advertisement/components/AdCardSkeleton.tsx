import { Skeleton } from "@/components/ui/skeleton";

export const AdCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 rounded-xl border p-4 shadow-sm">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex justify-between pt-4">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
};
