// src/components/Admin.jsx
import { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Admin.css'; // Importing CSS for styling

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          setIsAdmin(true);
          fetchUsers();
        } else {
          setIsAdmin(false);
        }
      }
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const adminEmail = auth.currentUser.email;
      const adminPassword = password;  // Temporarily reuse the password for simplicity

      // Create a new user
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        hasAccess: false,
        isAdmin: false
      });

      // Sign in the admin again to restore the session
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      setSuccess('User registered. Admin needs to grant access.');
      setError('');
      fetchUsers();
    } catch (error) {
      console.error("Registration error: ", error);
      setError(error.message);
      setSuccess('');
    }
  };

  const grantAccess = async (id, hasAccess) => {
    try {
      await updateDoc(doc(firestore, 'users', id), { hasAccess });
      setSuccess(`User access ${hasAccess ? 'granted' : 'revoked'}`);
      setError('');
      fetchUsers();
    } catch (error) {
      console.error("Error updating access: ", error);
      setError(error.message);
      setSuccess('');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'users', id));
      setSuccess('User deleted successfully.');
      setError('');
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
      setError(error.message);
      setSuccess('');
    }
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h2>Admin</h2>
      <form onSubmit={registerUser}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register User</button>
      </form>
      <h3>Users List</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Has Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.hasAccess ? 'Yes' : 'No'}</td>
              <td>
                <button className={`btn ${user.hasAccess ? 'btn-disable' : 'btn-enable'}`} onClick={() => grantAccess(user.id, !user.hasAccess)}>
                  {user.hasAccess ? 'Disable Access' : 'Enable Access'}
                </button>
                <button className="btn btn-delete" onClick={() => deleteUser(user.id)}>Delete User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default Admin;
