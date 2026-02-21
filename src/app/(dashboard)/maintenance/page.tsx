'use client';

import Link from 'next/link';
import { useState } from 'react';

// Mock Data [cite: 213-223]
const MOCK_TASKS = [
  { id: 't-001', roomId: '312', priority: 'HIGH', status: 'OPEN', updated: '10 mins ago' },
  { id: 't-002', roomId: '313', priority: 'MEDIUM', status: 'IN_PROGRESS', updated: '1 hour ago' },
  { id: 't-003', roomId: '105', priority: 'EMERGENCY', status: 'OPEN', updated: '2 mins ago' },
];

export default function MaintenanceDashboard() {
  const [searchRoom, setSearchRoom] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesRoom = task.roomId.includes(searchRoom);
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesRoom && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Filters [cite: 284-287] */}
      <div className="space-y-2 rounded-md bg-white p-3 shadow-sm">
        <input 
          type="text" 
          placeholder="Search Room #" 
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
          className="w-full rounded border p-2 text-sm focus:border-blue-500 focus:outline-none text-gray-700"
        />
        <select 
          className="w-full rounded border p-2 text-sm text-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Task Cards [cite: 288-292] */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
              <span className="font-bold text-gray-800">Room {task.roomId}</span>
              <span className="text-xs text-gray-500">{task.updated}</span>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Priority:</span>
                <span className={`rounded px-2 py-1 text-xs font-bold text-white 
                  ${task.priority === 'EMERGENCY' ? 'bg-red-600 animate-pulse' : 
                    task.priority === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-600">Status:</span>
                <span className="text-sm font-bold text-blue-600">{task.status.replace('_', ' ')}</span>
              </div>

              {/* [cite: 293-294] */}
              <Link href={`/maintenance/task/${task.id}`}>
                <button className="mt-2 w-full rounded border border-blue-500 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}