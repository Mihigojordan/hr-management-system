import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, User, Mail, Phone, MapPin, Camera, Plus } from 'lucide-react';
import clientService, { type CreateClientInput } from '../../../services/clientService';

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateClientInput) => Promise<void>;
}

const AddClientModal = ({ isOpen, onClose, onSave }: AddClientModalProps) => {
    const [formData, setFormData] = useState<CreateClientInput>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        status: 'ACTIVE',
        profileImgFile: null
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, profileImgFile: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, profileImgFile: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    useEffect(()=>{
        if(!isOpen){

            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                address: '',
                status: 'ACTIVE',
                profileImgFile: null
            });
            setErrors([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        setImagePreview(null);

        }
    },[isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const validation = clientService.validateClientData(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            setIsSubmitting(false);
            return;
        }
        
        try {
            await onSave(formData);
            setErrors([]);
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                address: '',
                status: 'ACTIVE',
                profileImgFile: null
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onClose();
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to add client';
            console.error('Error in handleSubmit:', error);
            setErrors([errorMessage]);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 ease-out scale-100">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Add New Client</h2>
                            <p className="text-orange-100 text-sm mt-1">Create a new client profile</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={triggerFileInput}
                                    className="w-24 h-24 rounded-full border-3 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
                                >
                                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
                                </div>
                            )}
                        </div>
                        
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors duration-200"
                        >
                            <Upload className="w-4 h-4" />
                            <span>{imagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                        </button>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>First Name</span>
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm placeholder-gray-400"
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm placeholder-gray-400"
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>Email Address</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter email address"
                            />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter phone number"
                        />
                    </div>

                            </div>

                              
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>Address</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter address"
                        />
                    </div>

                    {/* Error Messages */}
                    {errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <X className="w-3 h-3 text-red-600" />
                                </div>
                                <div className="space-y-1">
                                    {errors.map((error, index) => (
                                        <p key={index} className="text-red-700 text-sm font-medium">{error}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Add Client</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;