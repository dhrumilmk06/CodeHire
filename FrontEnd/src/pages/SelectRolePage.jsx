import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import axiosInstance from '../lib/axios';

export function SelectRolePage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      await axiosInstance.patch('/users/role', { role });
      
      // Update Clerk User metadata locally if needed, but for now just redirect:
      if (role === 'host') {
        navigate('/dashboard');
      } else {
        navigate('/my-interviews');
      }
    } catch (error) {
      console.error("Failed to update role", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center mt-20">Welcome to CodeHire! 🎉</h1>
        <p className="text-gray-400 text-lg mb-12 text-center">How will you use this platform?</p>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl text-white">
          {/* Host Card */}
          <button
            onClick={() => handleRoleSelect('host')}
            disabled={loading}
            className={`
              relative flex flex-col items-center justify-center p-8 rounded-xl bg-[#111111] border border-[#2a2a2a]
              transition-all duration-300
              hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:-translate-y-1
              ${selectedRole === 'host' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
              ${loading && selectedRole !== 'host' ? 'opacity-50' : ''}
            `}
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">I am an Interviewer</h2>
            <p className="text-gray-400">(Host)</p>
            {loading && selectedRole === 'host' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl rounded-xl">
                 <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          {/* Participant Card */}
          <button
             onClick={() => handleRoleSelect('participant')}
             disabled={loading}
             className={`
              relative flex flex-col items-center justify-center p-8 rounded-xl bg-[#111111] border border-[#2a2a2a]
              transition-all duration-300
              hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:-translate-y-1
              ${selectedRole === 'participant' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
              ${loading && selectedRole !== 'participant' ? 'opacity-50' : ''}
            `}
          >
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-2xl font-bold mb-2">I am a Candidate</h2>
            <p className="text-gray-400">(Participant)</p>
            {loading && selectedRole === 'participant' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl rounded-xl">
                 <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
