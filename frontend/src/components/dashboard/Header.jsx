import { Bell, LogOut, Menu, Settings, User, Lock, ChevronDown } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminAuth from '../../context/AdminAuthContext'
import { API_URL } from '../../api/api'

const Header = ({ onToggle }) => {
  const { user, logout, lockAdmin } = useAdminAuth()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLocking, setIsLocking] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.log(error);
    }
  }

  const handleLock = async () => {
    setIsLocking(true)
    try {
      await lockAdmin()
      // The context will update isLocked state, and the ProtectedRoute will handle the redirect
    } catch (error) {
      console.error('Lock error:', error)
      // You might want to show an error message here
    } finally {
      setIsLocking(false)
    }
  }

  // Get display name
  const getDisplayName = () => {
    return user?.adminName || 'Admin'
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex md:items-center flex-wrap justify-center gap-3 md:gap-0 md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg lg:hidden flex items-center justify-center cursor-pointer" onClick={onToggle}>
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Welcome to Dashboard Management</h1>
            </div>
          </div>
          
          <div className="flex md:items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLocking}
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profileImg ? (
                    <img 
                      src={`${API_URL}${user.profileImg}`} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-700">{getDisplayName()}</div>
                  <div className="text-xs text-primary-600">Administrator</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-primary-50">
                      <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
                      <div className="text-xs text-gray-600">{user?.adminEmail}</div>
                      <div className="text-xs font-medium text-primary-600">Administrator</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/admin/dashboard/profile');
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          handleLock();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isLocking}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isLocking ? 'Locking...' : 'Lock Screen'}
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header