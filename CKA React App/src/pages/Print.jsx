import { useState, useEffect } from "react";
import { getStudents } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Print = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Print
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Print</p>
        </div>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          Print Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Credit</th>
                  <th className="text-left p-3">Debit</th>
                  <th className="text-left p-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const due = student.fees.debit - student.fees.credit;
                  return (
                    <tr key={student.studentId} className="border-b">
                      <td className="p-3">{student.studentId}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3">{student.contact}</td>
                      <td className="p-3">Rs. {student.fees.credit}</td>
                      <td className="p-3">Rs. {student.fees.debit}</td>
                      <td className="p-3">Rs. {due}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Print;
