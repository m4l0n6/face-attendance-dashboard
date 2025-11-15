import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Tổng quan hệ thống</p>
      </div>
      <div className="gap-4 grid md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="font-medium text-sm">
              Tổng sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              123
            </div>
            <p className="text-muted-foreground text-xs">
              Sinh viên đã tham gia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              123
            </div>
            <p className="text-muted-foreground text-xs">Lớp học</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="font-medium text-sm">
              Tỉ lệ điểm danh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              123
            </div>
            <p className="text-muted-foreground text-xs">
              Tỉ lệ số sinh viên có mặt
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
