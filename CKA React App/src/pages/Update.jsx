import { useState } from "react";
import { searchStudent, updateStudent } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Update = () => {
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;

    try {
      const response = await searchStudent(searchId);
      setStudent(response.data);
      setFormData(response.data);
    } catch (error) {
      alert("Student not found");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(student.studentId, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update student");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Update
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CKA / Update</p>
        </div>
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            ✓ Student updated successfully!
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              type="search"
              placeholder="Enter Student ID to update..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          {student && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Father's Name
                  </label>
                  <Input
                    name="fatherName"
                    value={formData.fatherName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mother's Name
                  </label>
                  <Input
                    name="motherName"
                    value={formData.motherName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact
                  </label>
                  <Input
                    name="contact"
                    value={formData.contact || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">DOB</label>
                  <Input
                    name="DOB"
                    value={formData.DOB || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
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
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Student
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Update;
