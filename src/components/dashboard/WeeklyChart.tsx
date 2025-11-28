import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { WeeklyStatisticsResponse, WeeklyPeriod } from "@/services/statistics/typing";

interface WeeklyChartProps {
  weeklyStats: WeeklyStatisticsResponse | null;
  weeklyPeriod: WeeklyPeriod | "default";
  onPeriodChange: (value: WeeklyPeriod | "default") => void;
}

export function WeeklyChart({ weeklyStats, weeklyPeriod, onPeriodChange }: WeeklyChartProps) {
  const weeklyChartData = weeklyStats?.weeklyStats.map((week) => ({
    name: format(new Date(week.weekStart), "dd/MM", { locale: vi }),
    "Có mặt": week.totalAttended,
    "Vắng mặt": week.totalAbsent,
    "Tỉ lệ điểm danh": week.attendanceRate,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Thống kê điểm danh theo tuần
            </CardTitle>
            <CardDescription>
              {weeklyStats?.period && (
                <>
                  Từ {format(new Date(weeklyStats.period.startDate), "dd/MM/yyyy", { locale: vi })} đến{" "}
                  {format(new Date(weeklyStats.period.endDate), "dd/MM/yyyy", { locale: vi })}
                </>
              )}
            </CardDescription>
          </div>
          <Select
            value={weeklyPeriod}
            onValueChange={(value) => onPeriodChange(value as WeeklyPeriod | "default")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">4 tuần gần nhất</SelectItem>
              <SelectItem value="current-week">Tuần này</SelectItem>
              <SelectItem value="last-week">Tuần trước</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {weeklyChartData.length > 0 ? (
          <div className="space-y-6">
            {/* Bar Chart - Attendance Count */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827',
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4, color: '#111827' }}
                    itemStyle={{ color: '#111827' }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 16 }}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="Có mặt" 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                    activeBar={{ fill: '#059669', stroke: '#047857', strokeWidth: 1 }}
                  />
                  <Bar 
                    dataKey="Vắng mặt" 
                    fill="#f97316" 
                    radius={[6, 6, 0, 0]} 
                    activeBar={{ fill: '#ea580c', stroke: '#c2410c', strokeWidth: 1 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Attendance Rate */}
            <div className="h-[250px]">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Tỉ lệ điểm danh (%)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827',
                    }}
                    labelStyle={{ color: '#111827' }}
                    itemStyle={{ color: '#111827' }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Tỉ lệ điểm danh"]}
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '4 4' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Tỉ lệ điểm danh" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', stroke: '#4f46e5', strokeWidth: 2, r: 5 }}
                    activeDot={{ fill: '#4f46e5', stroke: '#312e81', strokeWidth: 2, r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu thống kê
          </div>
        )}
      </CardContent>
    </Card>
  );
}

