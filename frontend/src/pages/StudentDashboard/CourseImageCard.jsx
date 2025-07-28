import React, { useState } from 'react';
 
const CourseImageCard = ({ selectedCourse, couraseImageUrl }) => {
  const [imageError, setImageError] = useState(false);
 
  const courseName = selectedCourse?.courseName || "Untitled Course";
  const imageUrl = `${couraseImageUrl}${courseName.replace(/\s+/g, '%20')}.png`;
 
  return (
    <div className="relative h-52 rounded-xl overflow-hidden shadow-inner shadow-indigo-800/30">
      {
        !imageError ? (
          <div>
            <img
              src={imageUrl}
              alt={courseName}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </>
        )
      }
 
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-indigo-900 rounded-full shadow-sm">
            {selectedCourse?.branchName || "N/A"}
          </span>
        </div>
        <h3 className="mt-2 text-2xl font-bold text-white tracking-tight truncate">
          {courseName}
        </h3>
      </div>
    </div>
  );
};
 
export default CourseImageCard;