'use client';

// Mock Data [cite: 324-329]
const MOCK_ROOMS = [
  { id: '312', is_vacant: true, is_cleaned: false, assigned_to: 'Maria G.', tasks: 1, latest_note: 'Guest requested extra towels.' },
  { id: '313', is_vacant: false, is_cleaned: false, assigned_to: 'Unassigned', tasks: 0, latest_note: 'Late checkout.' },
  { id: '314', is_vacant: true, is_cleaned: true, assigned_to: 'Sarah T.', tasks: 0, latest_note: 'None' },
];

export default function RoomsManagement() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Rooms Management</h1>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
          Auto-Assign Housekeeping
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Room</th>
              <th className="px-6 py-3">Vacancy</th>
              <th className="px-6 py-3">Cleaned</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Open Tasks</th>
              <th className="px-6 py-3">Latest Note</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROOMS.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">{room.id}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-bold text-white ${room.is_vacant ? 'bg-green-500' : 'bg-red-500'}`}>
                    {room.is_vacant ? 'VACANT' : 'OCCUPIED'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {room.is_cleaned ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-500">No</span>}
                </td>
                <td className="px-6 py-4">{room.assigned_to}</td>
                <td className="px-6 py-4">
                  {room.tasks > 0 ? <span className="font-bold text-red-500">{room.tasks}</span> : '0'}
                </td>
                <td className="px-6 py-4 truncate max-w-[150px]" title={room.latest_note}>{room.latest_note}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}