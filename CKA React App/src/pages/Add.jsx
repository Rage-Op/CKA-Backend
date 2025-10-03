import { useState, useEffect } from "react";
import { addStudent, getBSDate, getAscendingStudents } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    contact: "",
    address: "",
    DOB: "",
    class: "P.G.",
    gender: "male",
    transport: false,
    diet: false,
  });
  const [studentId, setStudentId] = useState("...");
  const [admitDate, setAdmitDate] = useState("...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Get next student ID
      const studentsRes = await getAscendingStudents();
      const students = studentsRes.data;
      const nextId =
        students.length > 0 ? students[students.length - 1].studentId + 1 : 1;
      setStudentId(nextId);

      // Get current date
      const dateRes = await getBSDate();
      const datetimeStr = dateRes.data;
      const datePart = datetimeStr.split(" ")[0];
      const parts = datePart.split("-");
      const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
      setAdmitDate(formattedDate);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = {
      ...formData,
      studentId,
      admitDate,
      fees: {
        credit: 0,
        debit: 0,
      },
    };

    try {
      await addStudent(newStudent);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset form
      setFormData({
        name: "",
        fatherName: "",
        motherName: "",
        contact: "",
        address: "",
        DOB: "",
        class: "P.G.",
        gender: "male",
        transport: false,
        diet: false,
      });
      fetchInitialData();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      fatherName: "",
      motherName: "",
      contact: "",
      address: "",
      DOB: "",
      class: "P.G.",
      gender: "male",
      transport: false,
      diet: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Add</p>
        </div>
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            ✓ Student added successfully!
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Father's Name
                  </label>
                  <Input
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact
                  </label>
                  <Input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <Input
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mother's Name
                  </label>
                  <Input
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="transport"
                    checked={formData.transport}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Transport</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="diet"
                    checked={formData.diet}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Diet</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="P.G.">P.G.</option>
                    <option value="K.G.">K.G.</option>
                    <option value="nursery">Nursery</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {studentId}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Student Id
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {admitDate}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Admit Date
                  </p>
                </CardContent>
              </Card>

              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Admit
              </Button>

              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Add;
