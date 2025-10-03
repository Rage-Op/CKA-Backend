import { useState, useEffect } from "react";
import { getSettings, updateSettings, backup } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getSettings();
      if (response.data && response.data.length > 0) {
        setSettings(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update settings");
    }
  };

  const handleBackup = async () => {
    try {
      await backup();
      alert("Backup successful!");
    } catch (error) {
      alert("Backup failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            CKA / Settings
          </p>
        </div>
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg">
            ✓ Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  School Name
                </label>
                <Input
                  name="schoolName"
                  value={settings.schoolName || ""}
                  onChange={handleChange}
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Admin Email
                </label>
                <Input
                  name="adminEmail"
                  type="email"
                  value={settings.adminEmail || ""}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number
                </label>
                <Input
                  name="contactNumber"
                  value={settings.contactNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>
              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Backup Database</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create a backup of all student data
              </p>
              <Button onClick={handleBackup} className="w-full">
                Create Backup
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">System Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Version:</strong> 1.0.0
                </p>
                <p>
                  <strong>Database:</strong> Connected
                </p>
                <p>
                  <strong>Students:</strong> {settings.totalStudents || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
