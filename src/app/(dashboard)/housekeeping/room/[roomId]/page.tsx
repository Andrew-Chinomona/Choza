'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomDetail({ params }: { params: Promise<{ roomId: string }> }) {
    const router = useRouter();
    const { roomId } = use(params); // Unwraps the dynamic URL parameter

    // Temporary mock state
    const [isCleaning, setIsCleaning] = useState(false);
    const [isVacant] = useState(true); // Toggle this to false to see the button block!
    const [isCleaned, setIsCleaned] = useState(false);
    const [adminNote, setAdminNote] = useState('test note');
    const [noteText, setNoteText] = useState('');

    const handleStartCleaning = () => {
        // Eventually: POST /api/cleaning/start [cite: 403]
        setIsCleaning(true);
    };

    const handleMarkCleaned = () => {
        // Constraint: Blocked when is_vacant = false 
        if (!isVacant) {
            alert("Cannot mark an occupied room as cleaned!");
            return;
        }
        // Eventually: POST /api/cleaning/complete [cite: 404]
        setIsCleaned(true);
        setIsCleaning(false);
        alert('Room marked as cleaned!');
        router.push('/housekeeping'); // Send them back to the dashboard
    };

    const handleAddNote = () => {
        // Eventually: POST /api/notes [cite: 407]
        alert(`Note added: ${noteText}`);
        setNoteText('');
    };

    return (
        <div className="mx-auto max-w-md space-y-6 rounded-md bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Room {roomId}</h1>
                <div className="flex gap-2">
                    <span className={`rounded px-2 py-1 text-xs font-bold text-white ${isVacant ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isVacant ? 'VACANT' : 'OCCUPIED'}
                    </span>
                </div>
            </div>

            {/* Cleaning Actions */}
            <div className="space-y-3">
                {!isCleaning && !isCleaned && (
                    <button
                        onClick={handleStartCleaning}
                        className="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Start Cleaning
                    </button>
                )}

                {isCleaning && !isCleaned && (
                    <button
                        onClick={handleMarkCleaned}
                        disabled={!isVacant} // Enforces the locked rule [cite: 69]
                        className="w-full rounded bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Mark Cleaned
                    </button>
                )}

                {!isVacant && (
                    <p className="text-center text-xs text-red-500">
                        *Cleaning action is blocked while room is occupied
                    </p>
                )}
            </div>

            {/* Admin Note Display */}
            {adminNote && (
                <div className="mt-8 border-t pt-4">
                    <h3 className="mb-2 font-semibold text-gray-700">Notes from Administration</h3>
                    <p className="rounded border bg-yellow-50 p-3 text-sm text-gray-800">
                        {adminNote}
                    </p>
                </div>
            )}

            {/* Add Issue Note */}
            <div className="mt-8 border-t pt-4">
                <h3 className="mb-2 font-semibold text-gray-700">Add Issue Note</h3>
                <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full rounded border p-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="E.g., Missing towels, broken lamp..."
                />
                <button
                    onClick={handleAddNote}
                    disabled={!noteText}
                    className="mt-2 w-full rounded bg-gray-200 py-2 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                    Submit Note
                </button>
            </div>
        </div>
    );
}