import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";
import { useClassStore } from "@/stores/classes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  studentId: string;
  name: string;
  email: string;
}

interface ImportData {
  students: Student[];
}

interface CSVRow {
  studentId?: string;
  name?: string;
  email?: string;
}

interface ImportStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (classId: string, data: ImportData) => void;
}

export function ImportStudentsDialog({
  open,
  onOpenChange,
  onSubmit,
}: ImportStudentsDialogProps) {
  const { classes, fetchClasses } = useClassStore();
  const [classId, setClassId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Student[]>([]);

  useEffect(() => {
    if (open) {
      fetchClasses();
    }
  }, [open, fetchClasses]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          const students = (results.data as CSVRow[])
            .filter((row: CSVRow) => row.studentId && row.name && row.email)
            .map((row: CSVRow) => ({
              studentId: row.studentId!,
              name: row.name!,
              email: row.email!,
            }));
          setPreview(students.slice(0, 5));
        },
      });
    }
  };

  const handleSubmit = () => {
    if (file && classId) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const students = (results.data as CSVRow[])
            .filter((row: CSVRow) => row.studentId && row.name && row.email)
            .map((row: CSVRow) => ({
              studentId: row.studentId!,
              name: row.name!,
              email: row.email!,
            }));
          onSubmit(classId, { students });
          setFile(null);
          setPreview([]);
          setClassId("");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import sinh viên từ CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Chọn lớp học</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp học" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Chọn file CSV</Label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-2">
              File CSV cần có các cột: studentId, name, email
            </p>
          </div>
          {preview.length > 0 && (
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Xem trước (5 dòng đầu)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Mã SV</th>
                      <th className="text-left p-2">Tên</th>
                      <th className="text-left p-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row: Student, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{row.studentId}</td>
                        <td className="p-2">{row.name}</td>
                        <td className="p-2">{row.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!file || !classId}>
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
