'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MaintenanceTaskDetail({ params }: { params: Promise<{ taskId: string }> }) {
  const router = useRouter();
  const { taskId } = use(params);

  // Temporary mock data mapping to the architecture requirements [cite: 295-303]
  const MOCK_TASK = {
    id: taskId,
    roomId: '313',
    is_vacant: false,
    is_cleaned: false,
    priority: 'MEDIUM',
    initialStatus: 'IN_PROGRESS',
    accountability: {
      lastCleanedBy: 'Maria G.',
      cleaningDuration: '42 mins',
    },
    timeline: [
      { id: 1, author: 'Housekeeping', text: 'Bathroom sink pipe is leaking water onto the floor.', time: '2 hours ago' },
      { id: 2, author: 'Maintenance', text: 'Inspected pipe. Need to fetch a new O-ring from supply.', time: '1 hour ago' }
    ]
  };

  const [status, setStatus] = useState(MOCK_TASK.initialStatus);
  const [noteText, setNoteText] = useState('');

  const handleUpdateStatus = (newStatus: string) => {
    // Eventually: PATCH /api/maintenance/tasks/:id/status [cite: 413]
    setStatus(newStatus);
  };

  const handleAddNote = () => {
    // Eventually: POST /api/notes [cite: 407]
    alert(`Maintenance note added: ${noteText}`);
    setNoteText('');
  };

  const handleCloseTask = () => {
    // Eventually: POST /api/maintenance/tasks/:id/close [cite: 414]
    alert(`Task ${taskId} closed successfully!`);
    router.push('/maintenance'); // Route back to the maintenance dashboard
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      
      {/* Header & Room Info [cite: 297] */}
      <div className="rounded-md bg-white p-5 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <h1 className="text-xl font-bold text-gray-800">Task: {taskId}</h1>
          <span className={`rounded px-2 py-1 text-xs font-bold text-white 
            ${MOCK_TASK.priority === 'EMERGENCY' ? 'bg-red-600' : 'bg-yellow-500'}`}>
            {MOCK_TASK.priority}
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-bold text-gray-800">Room {MOCK_TASK.roomId}</span>
          <div className="flex gap-2">
            <span className={`rounded px-2 py-0.5 text-xs font-bold text-white ${MOCK_TASK.is_vacant ? 'bg-green-500' : 'bg-red-500'}`}>
               {MOCK_TASK.is_vacant ? 'VACANT' : 'OCCUPIED'}
            </span>
            {MOCK_TASK.is_cleaned && (
               <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">CLEANED</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Controls [cite: 306-307] */}
      <div className="rounded-md bg-white p-5 shadow-sm border border-gray-200 space-y-4">
        <h2 className="font-semibold text-gray-700">Task Status</h2>
        <div className="flex rounded-md shadow-sm">
          {['OPEN', 'IN_PROGRESS'].map((s) => (
            <button
              key={s}
              onClick={() => handleUpdateStatus(s)}
              className={`flex-1 px-4 py-2 text-sm font-medium border ${
                status === s 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } ${s === 'OPEN' ? 'rounded-l-md' : 'rounded-r-md'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleCloseTask}
          className="w-full rounded bg-green-600 py-3 font-bold text-white hover:bg-green-700 shadow-sm"
        >
          Mark as Closed
        </button>
      </div>

      {/* Accountability Info [cite: 301-303] */}
      <div className="rounded-md bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
        <div className="flex justify-between mb-1">
          <span>Last Cleaned By:</span>
          <span className="font-semibold text-gray-800">{MOCK_TASK.accountability.lastCleanedBy}</span>
        </div>
        <div className="flex justify-between">
          <span>Cleaning Duration:</span>
          <span className="font-semibold text-gray-800">{MOCK_TASK.accountability.cleaningDuration}</span>
        </div>
      </div>

      {/* Notes Timeline [cite: 300, 305] */}
      <div className="rounded-md bg-white p-5 shadow-sm border border-gray-200">
        <h2 className="font-semibold text-gray-700 mb-4 border-b pb-2">Notes Timeline</h2>
        
        <div className="space-y-4 mb-6">
          {MOCK_TASK.timeline.map((note) => (
            <div key={note.id} className={`p-3 rounded-md text-sm ${note.author === 'Housekeeping' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-100 border-l-4 border-gray-400'}`}>
              <p className="text-gray-800 mb-1">{note.text}</p>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>{note.author}</span>
                <span>{note.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Note */}
        <div className="space-y-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
            rows={2}
            placeholder="Add a maintenance update..."
          />
          <button 
            onClick={handleAddNote}
            disabled={!noteText}
            className="w-full rounded border border-gray-300 bg-gray-50 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Submit Note
          </button>
        </div>
      </div>
      
    </div>
  );
}