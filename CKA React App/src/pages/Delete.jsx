import { useState } from "react";
import { searchStudent, deleteStudent } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Delete = () => {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    if (!studentId) return;
    try {
      const response = await searchStudent(studentId);
      setStudent(response.data);
    } catch (error) {
      alert("Student not found");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await deleteStudent(student.studentId);
      setSuccess(true);
      setStudent(null);
      setStudentId("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to delete student");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Delete
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Delete</p>
        </div>
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            ✓ Student deleted successfully!
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delete Student</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter Student ID..."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {student && (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-900">
              <h3 className="text-lg font-semibold mb-4">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <p>
                  <strong>ID:</strong> {student.studentId}
                </p>
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Class:</strong> {student.class}
                </p>
                <p>
                  <strong>Contact:</strong> {student.contact}
                </p>
              </div>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Delete;
