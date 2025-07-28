import React from 'react';
import "./Certificate.css"

const Certificate = ({ courseInfo }) => {
  const studentName = courseInfo?.studentName || 'Student Name';
  const instructorName = courseInfo?.employeeName || 'Instructor Name';
  const courseName = courseInfo?.courseName || 'Course Name';
  const programName = courseInfo?.programName || 'Program Name';
  const semester = courseInfo?.semester || 'Semester';
  const collegeName = courseInfo?.collegeName || 'College Name';

  return (
    <div
      id="certificate"
      style={{
        width: '800px',
        height: '600px',
        backgroundColor: '#ffffff',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '8px double #4b5563',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}
    >
      <div className="logo-container">
        <img
          src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/bees.png"
          alt="Institution Logo"
        />
      </div>
      {/* Certificate Header */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h1
          style={{
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          Certificate of Completion
        </h1>
        <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '5px' }}>
          This certifies that
        </p>
      </div>

      {/* Student Name */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }} >
        <h2
          style={{
            fontSize: '30px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            color: '#1d4ed8',
          }}
        >
          {studentName}
        </h2>
        <div
          style={{
            width: '128px',
            height: '4px',
            backgroundColor: '#3b82f6',
            margin: '8px auto 0',
          }}
        ></div>
      </div>

      {/* Certificate Body */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '18px', color: '#374151' }}>
          has successfully completed the course
        </p>
        <h3
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginTop: '8px',
          }}
        >
          {courseName}
        </h3>
        <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '8px' }}>
          {programName} - {semester}
        </p>
        <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '4px' }}>
          {collegeName}
        </p>
        <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '4px' }}>
          Awarded on {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className='relative w-full h-full'>
        <img className='absolute -top-21  w-[700px] h-[200px]' src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/crtname.png" alt="bgimage" />

      </div>
      {/* Signatures */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '448px',
          marginTop: '32px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/rsign.png"
            alt="Instructor Signature"
            style={{ width: '96px', height: 'auto', margin: '0 auto 8px' }}
          />
          <p style={{ fontSize: '14px', color: '#374151' }}>
            {instructorName} (Instructor)
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/dire.png"
            alt="Director Signature"
            style={{ width: '96px', height: 'auto', margin: '0 auto 8px' }}
          />
          <p style={{ fontSize: '14px', color: '#374151' }}>Director Signature</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '80px',
          height: '80px',
          backgroundColor: '#06b6d4',
          opacity: '0.2',
          borderRadius: '50%',
          transform: 'translate(-40px, -40px)',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '80px',
          height: '80px',
          backgroundColor: '#06b6d4',
          opacity: '0.2',
          borderRadius: '50%',
          transform: 'translate(40px, 40px)',
        }}
      ></div>
    </div>
  );
};

export default Certificate;
