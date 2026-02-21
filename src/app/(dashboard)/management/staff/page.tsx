'use client';

// Mock Data [cite: 339-343]
const MOCK_STAFF = [
  { id: 'u-1', name: 'Maria Garcia', role: 'HOUSEKEEPER', rooms_assigned: 12, tasks_assigned: 0, status: 'Active' },
  { id: 'u-2', name: 'John Smith', role: 'MAINTENANCE', rooms_assigned: 0, tasks_assigned: 5, status: 'Active' },
  { id: 'u-3', name: 'Sarah T.', role: 'HOUSEKEEPER', rooms_assigned: 14, tasks_assigned: 0, status: 'Active' },
];

export default function StaffManagement() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Staff & Workload</h1>
        <button className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">
          + Add Employee
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Today's Workload</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STAFF.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">{staff.name}</td>
                <td className="px-6 py-4 text-xs font-semibold">{staff.role}</td>
                <td className="px-6 py-4">
                  {staff.role === 'HOUSEKEEPER' 
                    ? `${staff.rooms_assigned} Rooms` 
                    : `${staff.tasks_assigned} Open Tasks`}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button className="text-blue-600 hover:underline">Edit Workload</button>
                  <button className="text-red-600 hover:underline">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}