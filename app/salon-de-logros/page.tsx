'use client'; // Add this directive to ensure it works as a Client Component

import Image from 'next/image'; // Importing the Next.js Image component for optimized image rendering
import React, { useEffect, useState } from 'react'; // Importing necessary React hooks
import Gold from '../../components/images/gold.jpg'; // Importing the image for unlocked achievements
import Locked from '../../components/images/lock.jpg'; // Importing the image for locked achievements

// export const metadata = {
//   title: 'Salón de logros | Lecto'
// };

// Main component for the Home page
export default function Home() {
  // State to hold achievements data
  const [achievements, setAchievements] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to hold error messages if fetching fails
  const [error, setError] = useState(null);

  // Fetch user info when the component mounts
  useEffect(() => {
    const fetchSteak = async () => {
      try {
        const response = await fetch('/api/userInfo', {
          method: 'GET', // Specify the HTTP method
          headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();
        // Create the achievements data based on the response
        const data = [
          {
            id: 1,
            title: 'Puntaje perfecto',
            score: `10/10`,
            locked: result.data.perfectoCount < 1
          },
          {
            id: 2,
            title: '10 Evaluaciones completadas',
            locked: result.data.normalCount < 10
          },
          {
            id: 3,
            title: '20 Evaluaciones completadas',
            locked: result.data.normalCount < 20
          },
          {
            id: 4,
            title: '30 Evaluaciones completadas',
            locked: result.data.normalCount < 30
          }
        ];
        setAchievements(data); // Update the achievements state with fetched data
      } catch (err) {
        setError(err.message); // Update the error state
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchSteak(); // Call the fetch function on mount
  }, []); // Empty dependency array ensures this runs only once

  // Loading state rendering
  if (loading) return <div>Loading...</div>;

  // Error state rendering
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl sm:text-5xl font-bold mb-6">Salón de logros</h1>

      {/* Outer container for the whole section */}
      <div className="w-full bg-white p-4 sm:p-8 rounded-lg">
        {/* Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {achievements.map(({ id, title, score, locked }) => (
            <div
              key={id} // Unique key for each achievement
              className={`flex flex-col items-center py-6 px-2 border-4 ${locked ? 'border-gray-400' : 'border-yellow-400'}`}
              style={{ borderRadius: '70px', height: '400px' }} // Style for achievement box
            >
              <div>
                {/* Display the appropriate image based on lock status */}
                <Image
                  src={locked ? Locked : Gold} // Conditional rendering of images
                  alt="Achievement image" // Alternative text for the image
                  width={150} // Image width
                  height={150} // Image height
                />
              </div>
              <p
                className="mt-4 text-lg sm:text-xl font-bold text-center"
                style={{
                  marginTop: '50px',
                  width: '150px',
                  wordWrap: 'break-word'
                }}
              >
                {title} {/* Display the achievement title */}
              </p>
              {/* Display score if it exists */}
              {score && (
                <p className="text-lg sm:text-xl font-bold mt-2 text-center">
                  {score}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
