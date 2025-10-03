import { useState, useEffect } from "react";
import { getStudents, debitFees } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [success, setSuccess] = useState(false);

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

  const toggleStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleDebit = async () => {
    const updates = Array.from(selectedStudents).map((studentId) => {
      const student = students.find((s) => s.studentId === studentId);
      return {
        studentId,
        fees: {
          ...student.fees,
          credit: student.fees.credit + 1000, // Example: add 1000 to credit
        },
      };
    });

    try {
      await debitFees(updates);
      setSuccess(true);
      setSelectedStudents(new Set());
      fetchStudents();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update fees");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Fees</p>
        </div>
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            ✓ Fees updated successfully!
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Fees</CardTitle>
          <Button
            onClick={handleDebit}
            disabled={selectedStudents.size === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Update Selected ({selectedStudents.size})
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Select</th>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Credit</th>
                  <th className="text-left p-3">Debit</th>
                  <th className="text-left p-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const due = student.fees.debit - student.fees.credit;
                  return (
                    <tr
                      key={student.studentId}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.studentId)}
                          onChange={() => toggleStudent(student.studentId)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">{student.studentId}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3 text-green-600">
                        Rs. {student.fees.credit}
                      </td>
                      <td className="p-3 text-blue-600">
                        Rs. {student.fees.debit}
                      </td>
                      <td className="p-3 text-red-600">Rs. {due}</td>
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

export default Fees;
