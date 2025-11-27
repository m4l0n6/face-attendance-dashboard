import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useClassStore } from "@/stores/classes";
import { 
  getAdminOverview, 
  getWeeklyStatistics, 
  getClassStatistics, 
  getSessionStatistics 
} from "@/services/statistics";
import { getSchedulesByClass } from "@/services/schedules";
import { getScheduleWithSessions } from "@/services/sessions";
import type { 
  AdminOverviewResponse, 
  WeeklyStatisticsResponse,
  ClassStatisticsResponse,
  SessionStatisticsResponse,
  WeeklyPeriod
} from "@/services/statistics/typing";
import type { Schedule, ScheduleSession } from "@/services/schedules/typing";

import {
  OverviewCards,
  WeeklyChart,
  ClassStatisticsTable,
  SessionStatisticsTable,
  DashboardSkeleton,
} from "@/components/dashboard";

const DashboardPage = () => {
  const { token } = useAuthStore();
  const { classes, fetchClasses } = useClassStore();
  
  // Overview & Weekly states
  const [statistics, setStatistics] = useState<AdminOverviewResponse | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyPeriod, setWeeklyPeriod] = useState<WeeklyPeriod | "default">("default");

  // Class statistics states
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classStats, setClassStats] = useState<ClassStatisticsResponse | null>(null);
  const [isLoadingClassStats, setIsLoadingClassStats] = useState(false);
  const [classCurrentPage, setClassCurrentPage] = useState(1);

  // Session statistics states
  const [sessionClassId, setSessionClassId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStatisticsResponse | null>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingSessionStats, setIsLoadingSessionStats] = useState(false);
  const [sessionCurrentPage, setSessionCurrentPage] = useState(1);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const [overviewData, weeklyData] = await Promise.all([
          getAdminOverview(token),
          getWeeklyStatistics(token),
        ]);
        setStatistics(overviewData);
        setWeeklyStats(weeklyData);
        await fetchClasses();
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, fetchClasses]);

  // Fetch weekly stats when period changes
  useEffect(() => {
    const fetchWeekly = async () => {
      if (!token) return;
      
      try {
        const options = weeklyPeriod !== "default" ? { period: weeklyPeriod } : undefined;
        const data = await getWeeklyStatistics(token, options);
        setWeeklyStats(data);
      } catch (error) {
        console.error("Failed to fetch weekly statistics:", error);
      }
    };

    fetchWeekly();
  }, [token, weeklyPeriod]);

  // Fetch class statistics when class is selected
  useEffect(() => {
    const fetchClassStats = async () => {
      if (!token || !selectedClassId) {
        setClassStats(null);
        return;
      }
      
      try {
        setIsLoadingClassStats(true);
        const data = await getClassStatistics(token, selectedClassId);
        setClassStats(data);
        setClassCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch class statistics:", error);
        setClassStats(null);
      } finally {
        setIsLoadingClassStats(false);
      }
    };

    fetchClassStats();
  }, [token, selectedClassId]);

  // Fetch schedules when session class is selected
  useEffect(() => {
    const fetchSchedulesData = async () => {
      if (!token || !sessionClassId) {
        setSchedules([]);
        setSelectedScheduleId(null);
        setSessions([]);
        setSelectedSessionId(null);
        setSessionStats(null);
        return;
      }
      
      try {
        setIsLoadingSchedules(true);
        const data = await getSchedulesByClass(token, sessionClassId);
        setSchedules(data);
        setSelectedScheduleId(null);
        setSessions([]);
        setSelectedSessionId(null);
        setSessionStats(null);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setSchedules([]);
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    fetchSchedulesData();
  }, [token, sessionClassId]);

  // Fetch sessions when schedule is selected
  useEffect(() => {
    const fetchSessionsData = async () => {
      if (!token || !selectedScheduleId) {
        setSessions([]);
        setSelectedSessionId(null);
        setSessionStats(null);
        return;
      }
      
      try {
        setIsLoadingSessions(true);
        const data = await getScheduleWithSessions(token, selectedScheduleId);
        setSessions(data.sessions || []);
        setSelectedSessionId(null);
        setSessionStats(null);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        setSessions([]);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    fetchSessionsData();
  }, [token, selectedScheduleId]);

  // Fetch session statistics when session is selected
  useEffect(() => {
    const fetchSessionStatsData = async () => {
      if (!token || !selectedSessionId) {
        setSessionStats(null);
        return;
      }
      
      try {
        setIsLoadingSessionStats(true);
        const data = await getSessionStatistics(token, selectedSessionId);
        setSessionStats(data);
        setSessionCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch session statistics:", error);
        setSessionStats(null);
      } finally {
        setIsLoadingSessionStats(false);
      }
    };

    fetchSessionStatsData();
  }, [token, selectedSessionId]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Tổng quan hệ thống</p>
      </div>
      
      <OverviewCards statistics={statistics} />

      <WeeklyChart 
        weeklyStats={weeklyStats}
        weeklyPeriod={weeklyPeriod}
        onPeriodChange={setWeeklyPeriod}
      />

      <ClassStatisticsTable
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={setSelectedClassId}
        classStats={classStats}
        isLoading={isLoadingClassStats}
        currentPage={classCurrentPage}
        onPageChange={setClassCurrentPage}
      />

      <SessionStatisticsTable
        classes={classes}
        sessionClassId={sessionClassId}
        onSessionClassChange={setSessionClassId}
        schedules={schedules}
        selectedScheduleId={selectedScheduleId}
        onScheduleChange={setSelectedScheduleId}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSessionChange={setSelectedSessionId}
        sessionStats={sessionStats}
        isLoadingSchedules={isLoadingSchedules}
        isLoadingSessions={isLoadingSessions}
        isLoadingStats={isLoadingSessionStats}
        currentPage={sessionCurrentPage}
        onPageChange={setSessionCurrentPage}
      />
    </div>
  );
};

export default DashboardPage;
