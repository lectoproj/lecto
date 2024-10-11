'use client'; // Ensure it works as a Client Component

import { useEffect, useState } from 'react'; // Import necessary hooks from React
import Calendar from 'react-calendar'; // Importing the Calendar component from the 'react-calendar' library
import 'react-calendar/dist/Calendar.css'; // Import the default Calendar styles
import './calender.css'; // Import custom CSS for additional styling

// Define types for state management
type ValuePiece = Date | null; // Type for a single date value
type Value = ValuePiece | [ValuePiece, ValuePiece]; // Type for a value that can be a single date or a range of dates

// Interface for steak data fetched from the API
interface SteakData {
  fecha: string; // Date field as a string, expected format: 'YYYY-MM-DD'
}

// Main component for the calendar page
export default function CalendarPage() {
  // State for selected date or date range
  const [value, onChange] = useState<Value>(new Date());
  // State for steak data
  const [steak, setSteak] = useState<SteakData[] | null>([
    {
      fecha: '2024-01-01'
    }
  ]);

  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to hold error messages if fetching fails
  const [error, setError] = useState<string | null>(null);

  // Fetch steak data when the component mounts
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted to avoid memory leaks

    // Async function to fetch steak data
    const fetchSteak = async () => {
      try {
        const response = await fetch('/api/streak', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Check if the response is not OK and throw an error
        if (!response.ok) {
          const result = await response.json();

          throw new Error(result?.message);
        }

        // Parse the JSON response
        const result = await response.json();
        if (isMounted) {
          setSteak(result.data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message); // Set the error message
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Update loading state
        }
      }
    };

    fetchSteak(); // Call the fetch function on mount

    return () => {
      isMounted = false;
    }; // Cleanup function to set isMounted to false
  }, []);

  // Loading state rendering
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state rendering
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Convert active days from API to Date objects, normalizing the time
  const activeDates =
    steak?.map((item) => {
      const date = new Date(item.fecha);
      date.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparisons
      return date; // Return the normalized date object
    }) || []; // Default to an empty array if steak is null

  // Function to add a class to active days on the calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    // Normalize the date being checked
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Normalize to midnight

    // Check if the date is one of the active days
    const isActiveDay = activeDates.some(
      (activeDate) => activeDate.getTime() === normalizedDate.getTime()
    ); // Compare timestamps

    // Only add class for active days in month view
    return view === 'month' && isActiveDay ? 'active-day' : null; // Return class name or null
  };

  return (
    <main className="flex flex-col items-center p-6 from-purple-400 to-blue-300 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Learning Streak</h1>
        <p className="text-gray-600 mb-6">
          Your active days are highlighted on the calendar.
        </p>

        {/* Calendar component with margin */}
        <Calendar
          onChange={onChange} // Handle date changes
          // Current selected value
          tileClassName={tileClassName} // Apply custom class names to tiles
          className="mb-4" // Added margin bottom for spacing
        />

        {/* Legend to indicate active/inactive days */}
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-black block mr-2"></span>
            Active days
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-gray-300 block mr-2"></span>
            Inactive days
          </div>
        </div>
      </div>
    </main>
  );
}
