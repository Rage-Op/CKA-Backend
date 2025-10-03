import { useState, useEffect } from "react";
import { getStudents, getBSDate } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [totalDue, setTotalDue] = useState(0);
  const [top3Students, setTop3Students] = useState([]);
  const [reminders, setReminders] = useState(["", "", ""]);

  useEffect(() => {
    fetchData();
    loadReminders();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch students
      const studentsRes = await getStudents();
      const studentsData = studentsRes.data;
      setStudents(studentsData);

      // Calculate total due
      let due = 0;
      studentsData.forEach((student) => {
        due += student.fees.debit - student.fees.credit;
      });
      setTotalDue(due);

      // Find top 3 students with highest due
      const sortedByDue = [...studentsData]
        .map((student) => ({
          ...student,
          due: student.fees.debit - student.fees.credit,
        }))
        .filter((s) => s.due > 0)
        .sort((a, b) => b.due - a.due)
        .slice(0, 3);
      setTop3Students(sortedByDue);

      // Fetch date
      const dateRes = await getBSDate();
      const datetimeStr = dateRes.data;
      const datePart = datetimeStr.split(" ")[0];
      const parts = datePart.split("-");
      const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
      setDate(formattedDate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadReminders = () => {
    const savedReminders = [
      localStorage.getItem("listValue0") || "",
      localStorage.getItem("listValue1") || "",
      localStorage.getItem("listValue2") || "",
    ];
    setReminders(savedReminders);
  };

  const updateReminder = (index, value) => {
    const newReminders = [...reminders];
    newReminders[index] = value;
    setReminders(newReminders);
    localStorage.setItem(`listValue${index}`, value);
  };

  const clearReminder = (index) => {
    updateReminder(index, "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {date || "..."}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Students
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Rs. {totalDue}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Due Fees
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Required Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Student
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Contact
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Due Fees
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top3Students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="p-3 text-sm text-gray-900 dark:text-white">
                        {student.studentId} - {student.name} - {student.class}
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                        {student.contact}
                      </td>
                      <td className="p-3 text-sm text-gray-900 dark:text-white">
                        Rs. {student.due}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  onClick={() => clearReminder(index)}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                  {reminder && <span className="text-xs text-white">✓</span>}
                </button>
                <input
                  type="text"
                  placeholder={
                    index === 0
                      ? "Add a reminder here..."
                      : index === 1
                      ? "Tap on the check to clear reminder..."
                      : "Reminders are stored locally..."
                  }
                  value={reminder}
                  onChange={(e) => updateReminder(index, e.target.value)}
                  className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none text-sm py-1"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
