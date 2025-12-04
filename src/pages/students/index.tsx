import { useEffect, useState } from "react";
import { DataTable } from "@/components/common/DataTable";
import {
  createIndexColumn,
  createSortableColumn,
  createActionsColumn,
  createFilterSelect,
} from "@/components/common/DataTableHelpers";
import { ColumnDef } from "@tanstack/react-table";
import { useStudentStore } from "@/stores/students";
import type { Student } from "@/services/students/typing";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useClassStore } from "@/stores/classes";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Load } from "@/components/load";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/shadcn-io/image-crop";
import { XIcon } from "lucide-react";
import { postFaceImage, putFaceImage, getStudentByClassID } from "@/services/students";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import "react-medium-image-zoom/dist/styles.css";

const StudentsPage = () => {
  const {
    students,
    pagination,
    fetchStudents,
    isLoading,
    selectedClassId,
    setSelectedClass,
    currentPage,
    setPage,
    setPageSize,
    setSearchQuery,
  } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [faceImageFilter, setFaceImageFilter] = useState<string | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [isLoadingClass, setIsLoadingClass] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStudent, setUploadStudent] = useState<Student | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchClasses();
        await fetchStudents();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [fetchClasses, fetchStudents]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Handle class filter change
  const handleClassFilterChange = async (classId: string | null) => {
    if (classId) {
      // Use getStudentByClassID for specific class
      setIsLoadingClass(true);
      try {
        if (token) {
          const response = await getStudentByClassID(token, classId);
          setClassStudents(response.data);
        }
      } catch (error) {
        console.error('Error fetching students by class:', error);
        toast.error('Lỗi khi tải danh sách sinh viên');
      } finally {
        setIsLoadingClass(false);
      }
    } else {
      // Reset to show all students
      setClassStudents([]);
    }
    setSelectedClass(classId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleResetImage = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Get the base students list (either all students or class-specific)
  const baseStudents = selectedClassId ? classStudents : students;
  
  // Filter students based on face image status
  const filteredStudents = faceImageFilter
    ? baseStudents.filter((student) => {
        if (faceImageFilter === "registered") {
          return student.faceImage !== null;
        } else if (faceImageFilter === "not_registered") {
          return student.faceImage === null;
        }
        return true;
      })
    : baseStudents;

  const handleUploadFaceImage = async () => {
    if (!uploadStudent || !croppedImage || !token) {
      toast.error('Vui lòng cắt ảnh trước khi tải lên');
      return;
    }

    try {
      setIsUploading(true);
      // Convert cropped image dataURL to File
      const croppedFile = dataURLtoFile(croppedImage, `face_${uploadStudent.studentId}.jpg`);
      
      // Use PUT if student already has face image, POST if not
      if (uploadStudent.faceImage) {
        await putFaceImage(token, uploadStudent.faceImage.id, {
          image: croppedFile,
        });
      } else {
        await postFaceImage(token, {
          studentId: uploadStudent.id,
          image: croppedFile,
        });
      }
      
      toast.success(uploadStudent.faceImage ? 'Cập nhật ảnh khuôn mặt thành công!' : 'Tải ảnh khuôn mặt thành công!');
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setCroppedImage(null);
      setUploadStudent(null);
      
      // Refresh students list
      await fetchStudents();
    } catch (error) {
      console.error('Upload face image error:', error);
      toast.error(uploadStudent?.faceImage ? 'Cập nhật ảnh khuôn mặt thất bại' : 'Tải ảnh khuôn mặt thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const columns: ColumnDef<Student>[] = [
    createIndexColumn(),
    createSortableColumn("studentId", "Mã sinh viên"),
    createSortableColumn("name", "Tên sinh viên"),
    createSortableColumn("email", "Email"),
    // Only show class column when viewing all students (not filtered by specific class)
    ...(!selectedClassId ? [{
      accessorKey: "class.name" as keyof Student,
      header: "Lớp học",
      cell: ({ row }: { row: { original: Student } }) => row.original.class?.name || "-",
    }] : []),
    {
      accessorKey: "faceImage",
      header: "Khuôn mặt",
      cell: ({ row }) => (
        <Badge variant={row.original.faceImage ? "default" : "secondary"}>
          {row.original.faceImage ? "Đã đăng ký" : "Chưa đăng ký"}
        </Badge>
      ),
    },
    createActionsColumn({
      onView: (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
      },
      onEdit: (student) => {
        setUploadStudent(student);
        setIsUploadModalOpen(true);
      },
    })
  ];

  if (isLoading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Load />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Quản lý sinh viên</h1>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        isLoading={isLoading || isLoadingClass}
        searchKey="name"
        searchPlaceholder="Tìm kiếm theo tên sinh viên..."
        searchValue={localSearch}
        onSearchChange={setLocalSearch}
        filterComponents={[
          createFilterSelect(
            classes.map((cls) => ({
              label: cls.name,
              value: cls.id,
            })),
            {
              value: selectedClassId,
              onValueChange: handleClassFilterChange,
              placeholder: "Tất cả lớp",
              allLabel: "Tất cả lớp",
              className: "w-[200px]",
            }
          ),
          createFilterSelect(
            [
              { label: "Đã đăng ký", value: "registered" },
              { label: "Chưa đăng ký", value: "not_registered" },
            ],
            {
              value: faceImageFilter,
              onValueChange: setFaceImageFilter,
              placeholder: "Trạng thái khuôn mặt",
              allLabel: "Tất cả trạng thái",
              className: "w-[180px]",
            }
          ),
        ]}
        pagination={
          pagination && !faceImageFilter && !selectedClassId
            ? {
                currentPage: currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.total,
                pageSize: pagination.limit,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }
            : undefined
        }
      />

      {/* Student Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin sinh viên</DialogTitle>
            <DialogDescription>
              Chi tiết thông tin của sinh viên
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Avatar */}
              <div className="flex justify-center items-center">
                {selectedStudent.faceImage ? (
                  <ImageZoom
                    backdropClassName={cn(
                      '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                    )}
                  >
                    <img
                      src={selectedStudent.faceImage.imageUrl}
                      alt={selectedStudent.name}
                      className="rounded-full w-32 h-32 object-cover"
                    />
                  </ImageZoom>
                ) : (
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="" alt={selectedStudent.name} />
                    <AvatarFallback className="text-2xl">
                      {selectedStudent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Student Info */}
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Mã sinh viên
                  </p>
                  <p className="font-semibold">{selectedStudent.studentId}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Họ tên
                  </p>
                  <p className="font-semibold">{selectedStudent.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Email
                  </p>
                  <p className="font-semibold">{selectedStudent.email}</p>
                </div>
                <div className="space-y-2">
                  {!selectedClassId ? (
                    <>
                      <p className="font-medium text-muted-foreground text-sm">
                        Lớp học
                      </p>
                      <p className="font-semibold">
                        {selectedStudent.class?.name || "-"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-muted-foreground text-sm">
                        Trạng thái khuôn mặt
                      </p>
                      <Badge
                        variant={
                          selectedStudent.faceImage ? "default" : "secondary"
                        }
                      >
                        {selectedStudent.faceImage
                          ? "Đã đăng ký"
                          : "Chưa đăng ký"}
                      </Badge>
                    </>
                  )}
                </div>
                {!selectedClassId && (
                  <>
                  <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Mã lớp
                  </p>
                  <p className="font-semibold">
                    {selectedStudent.class?.code || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">
                    Trạng thái khuôn mặt
                  </p>
                  <Badge
                    variant={
                      selectedStudent.faceImage ? "default" : "secondary"
                    }
                  >
                    {selectedStudent.faceImage ? "Đã đăng ký" : "Chưa đăng ký"}
                  </Badge>
                </div>
                </>
                )}
                
              </div>

              {/* Lecturer Info */}
              {selectedStudent.class?.lecturer && (
                <div className="pt-4 border-t">
                  <p className="mb-3 font-semibold text-sm">Giảng viên</p>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground text-sm">
                        Họ tên
                      </p>
                      <p className="font-semibold">
                        {selectedStudent.class.lecturer.displayName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground text-sm">
                        Email
                      </p>
                      <p className="font-semibold">
                        {selectedStudent.class.lecturer.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Face Image Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {uploadStudent?.faceImage
                ? "Cập nhật ảnh khuôn mặt"
                : "Tải ảnh khuôn mặt"}
            </DialogTitle>
            <DialogDescription>
              {uploadStudent?.faceImage ? "Cập nhật" : "Tải"} ảnh khuôn mặt cho
              sinh viên {uploadStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Show existing image if student has one */}
            {uploadStudent?.faceImage && !selectedFile && (
              <div className="space-y-4">
                <Label>Ảnh hiện tại:</Label>
                <div className="flex justify-center">
                  <ImageZoom
                    backdropClassName={cn(
                      '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                    )}
                  >
                    <img
                      src={uploadStudent.faceImage.imageUrl}
                      alt={uploadStudent.name}
                      className="w-fit h-fit object-cover"
                    />
                  </ImageZoom>
                </div>
              </div>
            )}

            {!selectedFile ? (
              <div className="space-y-2">
                <Label htmlFor="face-image">
                  {uploadStudent?.faceImage
                    ? "Chọn ảnh mới"
                    : "Chọn ảnh khuôn mặt"}
                </Label>
                <Input
                  id="face-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-fit"
                />
                <p className="text-muted-foreground text-sm">
                  Chỉ chấp nhận file ảnh, tối đa 5MB
                </p>
              </div>
            ) : croppedImage ? (
              <div className="space-y-4">
                <Label>Ảnh đã cắt:</Label>
                <div className="flex justify-center">
                  <img
                    src={croppedImage}
                    alt="Cropped face"
                    className="w-fit h-fit object-cover"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleResetImage}
                    size="icon"
                    type="button"
                    variant="ghost"
                    disabled={isUploading}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label>Cắt ảnh khuôn mặt:</Label>
                <ImageCrop
                  file={selectedFile}
                  maxImageSize={1024 * 1024} // 1MB
                  onCrop={setCroppedImage}
                >
                  <ImageCropContent className="mx-auto max-w-md" />
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <ImageCropApply className="p-4 w-fit">
                      Áp dụng
                    </ImageCropApply>
                    <ImageCropReset className="p-4 w-fit">
                      Đặt lại
                    </ImageCropReset>
                    <Button
                      onClick={handleResetImage}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </ImageCrop>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setCroppedImage(null);
                  setUploadStudent(null);
                }}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleUploadFaceImage}
                disabled={!croppedImage || isUploading}
              >
                {isUploading
                  ? uploadStudent?.faceImage
                    ? "Đang cập nhật..."
                    : "Đang tải..."
                  : uploadStudent?.faceImage
                  ? "Cập nhật"
                  : "Tải lên"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
