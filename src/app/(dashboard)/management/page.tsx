'use client';

import Link from 'next/link';

// Mock Data for the Command Center [cite: 310-320]
const MOCK_METRICS = {
  rooms: {
    vacantNotCleaned: 14,
    vacantCleaned: 32,
    occupied: 104,
  },
  assignments: {
    totalAssigned: 118,
    completed: 45,
    activeHousekeepers: 8,
  },
  maintenance: {
    emergency: 1,
    high: 2,
    medium: 5,
    low: 8,
  }
};

const MOCK_NOTES = [
  { id: 1, room: '312', author: 'Housekeeping', text: 'Guest requested extra pillows.', time: '10 mins ago' },
  { id: 2, room: '105', author: 'Maintenance', text: 'AC unit filter replaced.', time: '45 mins ago' },
  { id: 3, room: '420', author: 'Housekeeping', text: 'Do not disturb sign is up.', time: '1 hour ago' },
];

export default function ManagementDashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Command Center</h1>
        
        {/* Quick Navigation Actions  */}
        <div className="flex gap-4">
          <Link href="/management/rooms">
             <button className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
               Manage Rooms
             </button>
          </Link>
          <Link href="/management/staff">
             <button className="rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700">
               Manage Staff
             </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Room Status Overview [cite: 311-314] */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-700">Room Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Vacant & Cleaned</span>
              <span className="font-bold text-green-600">{MOCK_METRICS.rooms.vacantCleaned}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Vacant & Dirty</span>
              <span className="font-bold text-red-500">{MOCK_METRICS.rooms.vacantNotCleaned}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-600">Occupied</span>
              <span className="font-bold text-blue-600">{MOCK_METRICS.rooms.occupied}</span>
            </div>
          </div>
        </div>

        {/* Assignments Progress [cite: 315-317] */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-700">Today's Assignments</h2>
          <div className="space-y-4">
             <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                   <span>Completion Progress</span>
                   <span>{Math.round((MOCK_METRICS.assignments.completed / MOCK_METRICS.assignments.totalAssigned) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(MOCK_METRICS.assignments.completed / MOCK_METRICS.assignments.totalAssigned) * 100}%` }}></div>
                </div>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Housekeepers:</span>
                <span className="font-bold">{MOCK_METRICS.assignments.activeHousekeepers}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rooms per Staff (Avg):</span>
                <span className="font-bold">{Math.round(MOCK_METRICS.assignments.totalAssigned / MOCK_METRICS.assignments.activeHousekeepers)}</span>
             </div>
          </div>
        </div>

        {/* Maintenance Overview [cite: 318-319] */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-700">Open Maintenance</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="rounded bg-red-50 p-3 border border-red-100 flex flex-col items-center">
                <span className="text-xs font-bold text-red-600 uppercase">Emergency</span>
                <span className="text-2xl font-bold text-red-700">{MOCK_METRICS.maintenance.emergency}</span>
             </div>
             <div className="rounded bg-orange-50 p-3 border border-orange-100 flex flex-col items-center">
                <span className="text-xs font-bold text-orange-600 uppercase">High</span>
                <span className="text-2xl font-bold text-orange-700">{MOCK_METRICS.maintenance.high}</span>
             </div>
             <div className="rounded bg-yellow-50 p-3 border border-yellow-100 flex flex-col items-center">
                <span className="text-xs font-bold text-yellow-600 uppercase">Medium</span>
                <span className="text-2xl font-bold text-yellow-700">{MOCK_METRICS.maintenance.medium}</span>
             </div>
             <div className="rounded bg-blue-50 p-3 border border-blue-100 flex flex-col items-center">
                <span className="text-xs font-bold text-blue-600 uppercase">Low</span>
                <span className="text-2xl font-bold text-blue-700">{MOCK_METRICS.maintenance.low}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Notes Feed [cite: 320] */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mt-8">
        <h2 className="mb-4 text-lg font-bold text-gray-700">Recent Notes Feed</h2>
        <div className="space-y-4">
          {MOCK_NOTES.map(note => (
            <div key={note.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded border-l-4 border-blue-500">
               <div className="font-bold text-gray-800 min-w-[60px]">Rm {note.room}</div>
               <div className="flex-1">
                  <p className="text-sm text-gray-800">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.author} • {note.time}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}