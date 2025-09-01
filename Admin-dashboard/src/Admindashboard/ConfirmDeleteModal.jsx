import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, studentId, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 className="text-xl mb-4">Are you sure you want to delete this student? It automatically delete the reference record if exists.</h3>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={() => onConfirm(studentId)}
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
