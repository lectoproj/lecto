'use client';
import { AuthContext } from 'app/contextApi/authContext';
import React, { useContext } from 'react';

interface UserInfo {
  id: string; // Assuming there's an id field
  name_tutor: string | null;
  email_tutor: string | null;
  nombre_tutor: string | null;
  nombre_email: string | null;
  fecha_nacimiento: string | null;
  password: string | null;
}

const UserInfo: React.FC = () => {
  const current = new Date().toISOString().split("T")[0];
  const { userInfo, setUserInfo } = useContext(AuthContext) || { userInfo: null };

  console.log("🚀 ~ userInfo:", userInfo);


  const getUserInfo = async () => {
    const userData = await fetch('/api/userInfo');
    const response = await userData.json();

    // Ensure setUserInfo exists before calling it
    if (setUserInfo) {
        setUserInfo(response?.data);
    }
  };

  const handleFormData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    const response = await fetch(`/api/userInfo/${userInfo?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });

    const result = await response.json();
    console.log("🚀 ~ handleFormData ~ result:", result)
    if (result?.data) {
      getUserInfo()
    }

  };

  const renderInputField = (
    id: keyof UserInfo,
    label: string,
    type: string,
    required: boolean,
    max?: string
  ) => {
    return userInfo && userInfo[id] == null && (
      <label htmlFor={id} className="mb-5">
        <span>{label}</span>
        <input
          type={type}
          name={id}
          id={id}
          className="w-full rounded border border-gray-300 bg-inherit p-3 shadow shadow-gray-100 mt-2 appearance-none outline-none text-neutral-800"
          placeholder=" "
          required={required}
          max={max}
        />
      </label>
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
      <form 
        onSubmit={handleFormData}
        className="bg-white shadow-lg rounded-md p-5 my-16 flex flex-col w-11/12 max-w-lg"
      >
        {userInfo && (
          <>
            {renderInputField('name_tutor', 'Nombre del Tutor', 'text', true)}
            {renderInputField('email_tutor', 'Email del Tutor', 'email', true)}
            {/* {renderInputField('fecha_nacimiento', 'Fecha Nacimiento', 'date', true, current)} */}
          </>
        )}

        <button type="submit" className="mt-5 bg-blue-500 py-3 rounded-md text-white">Enviar información de tutor</button>
      </form>
    </main>
  );
};

export default UserInfo;
