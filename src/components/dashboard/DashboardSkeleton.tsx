import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Tổng quan hệ thống</p>
      </div>
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row justify-between items-center space-y-0">
              <Skeleton className="w-24 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 w-16 h-8" />
              <Skeleton className="w-32 h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="w-48 h-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    </div>
  );
}

