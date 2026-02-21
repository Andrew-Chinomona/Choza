'use client';

import Link from 'next/link';
import { useState } from 'react';

// Temporary mock data to develop the UI without the database
const MOCK_ROOMS = [
  { id: '312', type: 'Double Queen', is_vacant: true, is_cleaned: false, has_maintenance: false },
  { id: '313', type: 'King Suite', is_vacant: false, is_cleaned: false, has_maintenance: true },
  { id: '314', type: 'Standard', is_vacant: true, is_cleaned: true, has_maintenance: false },
]; 

export default function HousekeepingDashboard() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CLEANED'>('ALL');

  // Filter logic based on the architecture specs
  const filteredRooms = MOCK_ROOMS.filter(room => {
    if (filter === 'PENDING') return !room.is_cleaned;
    if (filter === 'CLEANED') return room.is_cleaned;
    return true;
  });

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Metrics & Filters */}
      <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
        <div className="text-sm font-semibold text-gray-700">
          Rooms Left: {MOCK_ROOMS.filter(r => !r.is_cleaned).length}
        </div>
        <select 
          className="rounded border p-1 text-sm text-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="ALL">All Assigned</option>
          <option value="PENDING">Pending</option>
          <option value="CLEANED">Cleaned</option>
        </select>
      </div>

      {/* Room Cards List */}
      <div className="space-y-4">
        {filteredRooms.map((room) => (
          <div key={room.id} className="overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-bold text-gray-800">
              Room # {room.id}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <div className='flex flex-col items-center'>
                    <span className="font-semibold">Type</span>
                    <span className="mt-1 text-xs text-gray-400">{room.type}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-semibold">Status</span>
                  <span className={`mt-1 rounded px-2 py-1 text-xs font-bold text-white ${room.is_vacant ? 'bg-green-500' : 'bg-red-500'}`}>
                    {room.is_vacant ? 'VACANT' : 'OCCUPIED'}
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Clean</span>
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded border border-gray-400">
                    {room.is_cleaned && <span className="text-purple-600">✔</span>}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-semibold">Maint.</span>
                  {room.has_maintenance ? (
                     <span className="mt-1 text-xs font-bold text-red-600">ALERT</span>
                  ) : (
                     <span className="mt-1 text-xs text-gray-400">None</span>
                  )}
                </div>
              </div>

              {/* Action Button to go to the dynamic route */}
              <Link href={`/housekeeping/room/${room.id}`}>
                <button className="mt-4 w-full rounded border border-blue-500 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                  Open Room Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}