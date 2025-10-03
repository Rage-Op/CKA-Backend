import { useState } from "react";
import { searchStudent } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    setLoading(true);
    setNotFound(false);

    try {
      const response = await searchStudent(studentId);
      setStudent(response.data);
      setNotFound(false);
    } catch (error) {
      setStudent(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const due = student ? student.fees.debit - student.fees.credit : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Search</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              type="search"
              placeholder="Search...(Student ID)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {notFound && (
            <div className="text-center py-8">
              <img
                src="/content/user-not-found-icon.jpg"
                alt="Not Found"
                className="w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <p className="text-gray-600 dark:text-gray-400">
                Student not found
              </p>
            </div>
          )}

          {student && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src="/content/user-icon.jpg"
                    alt="Student"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Name:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      DOB:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.DOB}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Father's Name:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.fatherName}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Mother's Name:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.motherName}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Contact:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.contact}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Address:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.address}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Class:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.class}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Admit Date:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.admitDate}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Transport:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.transport ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Diet:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.diet ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Gender:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.gender}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Student-Id:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {student.studentId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Npr. {student.fees.credit}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Credit
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Npr. {student.fees.debit}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Debit
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      Npr. {due}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Search;
