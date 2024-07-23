// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Home from './components/Home';
import Settings from './components/Settings';
import Test from './components/Test';
import Results from './components/Results';
import Notebook from './components/Notebook';
import Login from './components/Login';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking auth state...");
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User signed in: ", user);
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUser(user);
          setHasAccess(userDoc.data().hasAccess);
          setIsAdmin(userDoc.data().isAdmin);
        } else {
          setUser(null);
          setHasAccess(false);
          setIsAdmin(false);
        }
      } else {
        console.log("No user signed in");
        setUser(null);
        setHasAccess(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setHasAccess(false);
    setIsAdmin(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("User: ", user, "Has Access: ", hasAccess, "Is Admin: ", isAdmin);

  return (
    <Router>
      <div className="container">
        <Navbar user={user} logout={logout} />
        <Routes>
          {user && hasAccess ? (
            <>
              <Route path="/" element={<Home user={user} logout={logout} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/test" element={<Test />} />
              <Route path="/results" element={<Results />} />
              <Route path="/notebook" element={<Notebook />} />
              {isAdmin && <Route path="/admin" element={<Admin />} />}
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
