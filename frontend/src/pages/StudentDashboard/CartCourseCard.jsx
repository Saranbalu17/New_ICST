import React, { useState } from 'react';
import { BookOpen, Trash2 } from 'lucide-react';
 
const baseUrlImage = "https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/COURSETHUMBNAILS/";
 
const CartCourseCard = ({ course, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = `${baseUrlImage}${course?.courseName?.replace(/\s+/g, '%20')}.png`;
 
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="relative h-40">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={course?.courseName || "Course"}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </>
        )}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-semibold text-white truncate">
            {course?.courseName || "Untitled Course"}
          </h3>
        </div>
      </div>
 
      <div className="p-5 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen size={18} className="mr-2 text-indigo-500" />
          <span className="font-medium">{course?.courseCode || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-900 font-semibold">
            Fee: ₹{course?.amount || "0.00"}
          </p>
          <button
            onClick={() => onRemove(course)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default CartCourseCard;