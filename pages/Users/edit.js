import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { updateUser } from '../../.husky/apiData/UserData';
import UserForm from '../../components/Forms/UserForm';

export default function UpdateProfile() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = (formData) => {
    updateUser(user.id, formData)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5 mb-4">Update Profile</h1>
      <UserForm onSubmit={handleSubmit} initialData={user} />

    </div>
  );
}
