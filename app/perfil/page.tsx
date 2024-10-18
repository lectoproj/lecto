"use client"; // Ensure it works as a Client Component

import React, { useEffect, useState } from "react"; // Import necessary hooks from React

// export const metadata = {
//   title: 'Mi perfil | Lecto'
// };

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/userInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const { data } = await response.json(); // Destructure the result directly
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Runs only once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden mt-8 p-8">
      {/* Name Header */}
      <h1 className="text-center text-3xl font-bold mb-8">
        {userData.name}
      </h1>

      {/* Profile Details Section */}
      <div className="overflow-hidden rounded-3xl border-[3px] border-gray-400">
        <table className="w-full border-collapse">
          <tbody>
            {/* Map through user data keys for cleaner code */}
            {[
              { label: 'Correo', value: userData.email },
              { label: 'Fecha de nacimiento', value: userData.fecha_nacimiento },
              { label: 'Correo tutor', value: userData.email_tutor },
              { label: 'Nombre tutor', value: userData.name_tutor },
            ].map(({ label, value }, index) => (
              <tr key={index} className="border-b-[3px] border-gray-400">
                <td className="px-8 py-6 font-semibold">{label}:</td>
                <td className="px-8 py-6">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
