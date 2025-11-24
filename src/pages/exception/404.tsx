import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center bg-background p-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/not-found.avif" alt="" />
          <CardTitle className="text-2xl">Trang không tồn tại</CardTitle>
          <CardDescription>
            Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex sm:flex-row flex-col gap-2">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Quay lại
            </Button>
            <Button asChild className="flex-1">
              <Link to="/dashboard">
                <Home className="mr-2 w-4 h-4" />
                Trang chủ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}