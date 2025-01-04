import React, { useEffect } from "react";

function SuccessModal({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1600);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white flex flex-col justify-center items-center rounded-lg p-6 shadow-lg w-1/2 h-1/3">
        <img src="/images/greencheck.png" alt="check" className="w-20" />
        <h1 className="text-green-600 text-lg font-bold mt-7">{message}</h1>
      </div>
    </div>
  );
}

export default SuccessModal;
