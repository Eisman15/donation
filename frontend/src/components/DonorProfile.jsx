import { useState, useEffect } from 'react';

const DonorProfile = ({ onSubmit, onCancel, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    isAnonymous: false,
    emailNotifications: true,
    newsletter: true,
    preferredPaymentMethod: 'credit_card'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.personalInfo?.firstName || '',
        lastName: initialData.personalInfo?.lastName || '',
        phone: initialData.personalInfo?.phone || '',
        isAnonymous: initialData.preferences?.isAnonymous || false,
        emailNotifications: initialData.preferences?.emailNotifications !== false,
        newsletter: initialData.preferences?.newsletter !== false,
        preferredPaymentMethod: initialData.preferences?.preferredPaymentMethod || 'credit_card'
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        setErrors({ submit: error.message || `Failed to ${isEditMode ? 'update' : 'create'} donor profile` });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Donor Profile' : 'Create Donor Profile'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="preferredPaymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Payment Method
          </label>
          <select
            id="preferredPaymentMethod"
            name="preferredPaymentMethod"
            value={formData.preferredPaymentMethod}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="isAnonymous"
              name="isAnonymous"
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
              Make my donations anonymous by default
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
              Receive email notifications about my donations
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              checked={formData.newsletter}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
              Subscribe to newsletters and updates
            </label>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Profile' : 'Create Donor Profile')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      </form>
    </div>
  );
};

export default DonorProfile;