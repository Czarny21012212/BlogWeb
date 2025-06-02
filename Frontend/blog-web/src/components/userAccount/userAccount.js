import React from 'react';
import { useParams } from 'react-router-dom';

const UserAccount = () => {
  const { id } = useParams();
  console.log(id); // Log the user ID to the console'

  return <div>Konto użytkownika o ID: {id}</div>;
};

export default UserAccount;
