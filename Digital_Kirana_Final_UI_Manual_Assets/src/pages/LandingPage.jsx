import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/kirana-bg.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 p-10 rounded-lg text-center">
        <img src="/logo.png" alt="Digital Kirana" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">DIGITAL KIRANA</h1>
        <p className="mt-2 text-xl">Digitizing Local Kirana Shops</p>
        <button
          className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 transition"
          onClick={() => navigate('/dashboard')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
