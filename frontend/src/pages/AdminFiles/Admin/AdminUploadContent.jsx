import { useEffect, useState } from "react";
import {
  FileText,
  BookOpen,
  Heading,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Video,
  Image,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

const AdminUploadContent = () => {
  const [videoName, setVideoName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState([]);
  const [programbasedBranch, setProgrambasedBranch] = useState([])
  const [programbasedSem, setProgrambasedSem] = useState([])
  const [programbasedRegaulation, setProgrambasedRegulation] = useState([])
  const [thumbnail, setThumbnail] = useState(null);
  const [step, setStep] = useState(0);
  const [branchError, setBranchError] = useState("");
  const [programs, setPrograms] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [regulation, setRegulation] = useState('')
  const [branchId, setBranchId] = useState([])
  const [programbasedSubjects, setProgrambasedSubjects] = useState([])
  const [type, setType] = useState('pdf')
  const [file, setFile] = useState(null)
  const [fileExtenstion, setFileExtension] = useState('')
  const [unit, setUnit] = useState(0)
  const [videoDuration, setVideoDuration] = useState('')
  const [courseCode,setCoueseCode]=useState('')
  const [unitWise, setUnitWise] = useState([])
  const [topicWise, setTopicWise] = useState([])
  const[topicName,setTopicName]=useState('')
  const navigate = useNavigate()
  const grpCode = 'devprod'
  const colCode = '0001'
  const collegeId = 1

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const parsed = JSON.parse(value)
    const branchName = parsed.name
    const id = parsed.id
    setBranchError("");
    if (branch.includes(branchName)) {
      setBranchError("Already Existing Branch");
      setTimeout(() => setBranchError(""), 3000);
    } else {
      setBranch([...branch, branchName]);
      setBranchId([...branchId, id])
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      const formData = new FormData()
      formData.append('grpCode', grpCode)
      formData.append('colCode', colCode)
      formData.append('collegeId', collegeId)
      formData.append('programId', course)
      formData.append('branchId', branchId)
      formData.append('regulationId', regulation)
      formData.append('semid', semester)
      formData.append('id', 1)
      formData.append('userId', 1)
      formData.append('loginIpAddress', '103.52.37.34')
      formData.append('LoginSystemName', 'desktop')
      formData.append('Flag', 'CREATE')
      formData.append('CourseId', subject)
      formData.append('CourseCode', courseCode)
      formData.append('TopicId', topic)
      formData.append('TopicName', topicName)
      formData.append('VideoName', videoName)
      formData.append('Description', description)
      formData.append('UnitId', unit)
      formData.append('File', file)
      formData.append('VideoStart', '0:00')
      formData.append('VideoEnd', videoDuration)
      const tableVariable = [{
        Column1: file.name,
        Column2: 0, // Get file extension from MIME type
        Column3: '', // Default int value
        Column4: '', // Default string value
        Column5: ''  // Default string value
      }];
      formData.append('tabelVariableforVideos', tableVariable)
      // formData.append('tabelVariableforVideos',[fileExtenstion])
      const res = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_UploadedCourseLevelVideos', formData, {
        headers: 'multipart/form-data'
      })
      if (res.data.message === 'Record is Successfully Saved') {
        setVideoName('')
        setBranch([])
        setDescription('')
        setSemester('')
        setThumbnail(null)
        setStep(0)
        setBranchError('')
        setThumbnailPreview(null)
        setSubject('')
        setTopic('')
        setCourse('')
        setRegulation('')
        setBranchId([])
        setFile(null)
        setFileExtension('')
        setUnit(0)
        setVideoDuration('')
        setType('pdf')
        setTimeout(()=>{
          alert('Record is Successfully Saved')
          navigate('/view/all/videos')
        },2000)
      }

    } catch (error) {
      console.log(error);
    }

  };

  const handleDeletion = (individualBranch) => {
    setBranch(
      branch.filter((removeBranch) => removeBranch !== individualBranch)
    );
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileExtension = file.name.split('.').pop()
      setThumbnail(file);
      setFile(file)
      setFileExtension(fileExtension)
      if (file.type.startsWith("video")) {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          const hours = Math.floor(video.duration / 3600)
          const minutes = Math.floor(video.duration / 60)
          const seconds = Math.floor(video.duration % 60)
          const videoEnd = hours + ":" + minutes + ':' + seconds;
          console.log(videoEnd);
          setVideoDuration(videoEnd)
        }
        video.src = URL.createObjectURL(file);
      }
    }
    if (file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
    else {
      setThumbnailPreview(null)
    }


  };
  const getFileTypeIcon = () => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'image': return <Image className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getAcceptedFormats = () => {
    switch (type) {
      case 'pdf': return 'PDF files up to 10MB';
      case 'video': return 'MP4, MOV, AVI up to 100MB';
      case 'image': return 'PNG, JPG, GIF up to 10MB';
      default: return 'PDF files up to 10MB';
    }
  };
  const stepTitles = ["Course Details", "Course & Topic", "Content Information", "Media Upload"];
  const stepIcons = [BookOpen, Heading, FileText, Upload];

  //program fetching 
  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_ProgramsFetching', { grpCode, colCode, collegeId })
        const { programFetchList } = response.data
        console.log(programFetchList)
        setPrograms(programFetchList)
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllPrograms()
  }, [])

  // branchFetchingOnProgramBasis
  useEffect(() => {
    if (!course) {
      return;
    }
    else {
      const fetchAllBranches = async () => {
        try {
          setBranch('')

          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_BranchFetching', { grpCode, colCode, programId: course })
          const { branchDropDownList } = response.data
          console.log(branchDropDownList)
          setProgrambasedBranch(branchDropDownList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllBranches()
    }
  }, [course])

  // semFetchingOnProgramBasis
  useEffect(() => {
    if (!course) {
      return;
    }
    else {
      const fetchAllSemester = async () => {
        try {
          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_SemFetching', { grpCode, colCode, programId: course })
          const { semDropDownList } = response.data
          setProgrambasedSem(semDropDownList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllSemester()
    }
  }, [course])


  //regulationbasedonProgrambasis

  useEffect(() => {
    if (!course) {
      return;
    }
    else {
      const fetchAllRegualation = async () => {
        try {
          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_RegulationDropDownFetching', { grpCode, colCode, collegeId })
          const { regulationDropdownList } = response.data
          setProgrambasedRegulation(regulationDropdownList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllRegualation()
    }
  }, [course])


  //coursebasedonprogramcourse


  useEffect(() => {
    if (!course || !branch || !regulation || !semester) {
      return;
    }
    else {
      const fetchAllCourses = async () => {
        try {
          const branchId1 = branchId.join(",");
          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_LMSProgramBranchLevelCourseDropDown', { grpCode, colCode, collegeId, ProgramId: course, RegulationId: regulation, branchId: branchId1, Semid: semester })
          const { examDropDownList } = response.data
          console.log(examDropDownList)
          setProgrambasedSubjects(examDropDownList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllCourses()
    }
  }, [course, branch, regulation, semester])

  //unitsfetching  

  useEffect(() => {
    if (!course || !branch || !regulation || !semester || !subject) {
      return;
    }
    else {
      const fetchAllUnits = async () => {
        try {
          const branchId1 = branchId.join(",");
          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/UnitwiseDropDown', { grpCode, colCode, collegeId, ProgramId: course, RegulationId: regulation, branchId: branchId1, Semid: semester, courseId: subject })
          const { courseChaptersList } = response.data
          setUnitWise(courseChaptersList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllUnits()
    }
  }, [course, branch, regulation, semester, subject])

  useEffect(() => {
    if (!course || !branch || !regulation || !semester || !subject || !unit) {
      return;
    }
    else {
      const fetchAllUnitsTopics = async () => {
        try {
          const branchId1 = branchId.join(",");
          const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/UnitwiseDropDown', { grpCode, colCode, collegeId, ProgramId: course, RegulationId: regulation, branchId: branchId1, Semid: semester, courseId: subject, unitId: unit })

          const { courseChaptersList } = response.data
          setTopicWise(courseChaptersList)
        } catch (error) {
          console.log(error);
        }
      }
      fetchAllUnitsTopics()
    }
  }, [course, branch, regulation, semester, subject, unit])


  //https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_LMSCourseTopicsDropdown


  //type change usefect

  useEffect(() => {
    if (!type) {
      return;
    }
    else {
      setFile(null)
      setThumbnail(null)
      setThumbnailPreview(null)
      setFileExtension('')
    }
  }, [type])

const handleCourseChange=(e)=>{
   setSubject(e.target.value)
   const sub=programbasedSubjects.find((s)=>s.courseId===Number(e.target.value))
   setCoueseCode(sub.courseCode)
}

const handleTopicChange=(e)=>{
   setUnit(e.target.value)
   const sub=unitWise.find((s)=>s.unitId===Number(e.target.value))
   setTopicName(sub.topicName)
}



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-nunito">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Upload Course Content
          </h1>
          <p className="text-gray-600 text-lg">
            Create and share educational content with your students
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            {stepTitles.map((title, index) => {
              const Icon = stepIcons[index];
              const isActive = step === index;
              const isCompleted = step > index;

              return (
                <div key={index} className="flex flex-col items-center relative bg-gray-50 px-2">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300
                    ${isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isActive
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium text-center ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Error Display */}
            {branchError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm">{branchError}</p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Step 0: Course Details */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Program
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      required
                    >
                      <option value="">Select a Program</option>
                      {programs.map((program) => (
                        <option value={program.programId} key={program.programId}>
                          {program.programShortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Branch
                    </label>

                    {/* Selected Branches */}
                    {branch.length > 0 && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex flex-wrap gap-2">
                          {branch.map((individualBranch, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-blue-200 text-sm"
                            >
                              <span className="font-medium text-blue-900">
                                {individualBranch}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeletion(individualBranch)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      onChange={handleChange}
                      value=''

                    >
                      <option value="">Add a branch</option>
                      {programbasedBranch && programbasedBranch.map((programBranch) => (
                        <option value={JSON.stringify({ id: programBranch.branchId, name: programBranch.branchDisplay })} key={programBranch.branchId}>
                          {programBranch.branchDisplay}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Regualtion
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      value={regulation}
                      onChange={(e) => setRegulation(e.target.value)}
                      required
                    >
                      <option value="">Select a Regualtion</option>
                      {programbasedRegaulation && programbasedRegaulation.map((programRegualtion) => (
                        <option value={programRegualtion.regulationId} key={programRegualtion.regulationId}>
                          {programRegualtion.regulationName}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Semester
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      required
                    >
                      <option value="">Select a semester</option>
                      {programbasedSem && programbasedSem.map((programSem) => (
                        <option value={programSem.semId} key={programSem.semId}>
                          {programSem.semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 1: Course & Topic */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Course Name
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                      value={subject}
                      onChange={(e) => handleCourseChange(e)}
                    >
                      <option value="">Select a course</option>
                      {programbasedSubjects && programbasedSubjects.map((programSubject) => (
                        <option value={programSubject.courseId} key={programSubject.courseCode}>
                          {programSubject.courseName}
                        </option> 
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Unit Name
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                      value={unit}
                      onChange={(e) => handleTopicChange(e)}
                    >
                      <option value="">Select a Unit</option>
                      {unitWise && unitWise.map((unit) => (
                        <option value={unit.unitId} key={unit.unitId}>
                          {unit.unitName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Topic
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="">Select a Topic</option>
                      {
                        topicWise && topicWise.map((topic) => (
                          <option value={topic.topicId} key={topic.topicId}>{topic.topicName}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Content Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Video Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={videoName}
                      onChange={(e) => setVideoName(e.target.value)}
                      placeholder="Enter an engaging video title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Video Description
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what students will learn from this video..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Media Upload */}
              {step === 3 && (
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm p-8 space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Upload Your File
                    </h2>
                    <p className="text-gray-600">Choose your file type and upload your content</p>
                  </div>

                  {/* File Type Selector */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-900">
                      Select File Type
                    </label>
                    <div className="relative">
                      <select
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                        className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg font-medium text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                      >
                        <option value="pdf"> PDF Document</option>
                        <option value="video"> Video File</option>
                        <option value="image"> Image File</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        {getFileTypeIcon()}
                      </div>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-900">
                      Upload {type === 'pdf' ? 'Document' : type === 'video' ? 'Video' : 'Image'}
                    </label>

                    <div className="relative group">
                      <input
                        type="file"
                        accept={type === 'pdf' ? '.pdf' : type === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                        required
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center w-full h-80 border-3 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-gradient-to-b from-gray-50 to-white hover:from-indigo-50 hover:to-blue-50 hover:border-indigo-400 transition-all duration-500 group relative overflow-hidden"
                      >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {thumbnailPreview ? (
                          <div className="relative w-full h-full z-10">
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-3xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="text-center space-y-2">
                                <Upload className="w-12 h-12 text-white mx-auto animate-bounce" />
                                <span className="text-white font-bold text-xl">
                                  Click to change
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-6 z-10 relative">
                            <div className="relative">
                              <Upload className="w-20 h-20 text-gray-400 group-hover:text-indigo-500 transition-all duration-300 mx-auto group-hover:scale-110 group-hover:animate-pulse" />
                              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-2xl font-bold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
                                Drop your file here
                              </p>
                              <p className="text-lg text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                                or click to browse
                              </p>
                              <p className="text-sm text-gray-400 font-medium">
                                {getAcceptedFormats()}
                              </p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Success Message */}
                  {thumbnail && (
                    <div className="relative overflow-hidden">
                      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl flex items-center space-x-4 transform animate-in slide-in-from-bottom duration-500">
                        {/* Success Icon with Animation */}
                        <div className="relative">
                          <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
                          <div className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping"></div>
                        </div>

                        <div className="flex-1">
                          <p className="text-lg font-bold text-emerald-800">
                            File uploaded successfully! 🎉
                          </p>
                          <p className="text-emerald-700 font-medium">
                            {thumbnail.name}
                          </p>
                          <p className="text-sm text-emerald-600">
                            Size: {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        {/* File type badge */}
                        <div className="px-4 py-2 bg-emerald-100 rounded-xl flex items-center space-x-2">
                          {getFileTypeIcon()}
                          <span className="text-sm font-semibold text-emerald-700 uppercase">
                            {type}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demo Controls */}
                  <div className="pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-4">Demo Controls:</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setStep(step === 3 ? 2 : 3)}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                      >
                        {step === 3 ? 'Hide' : 'Show'} Upload Form
                      </button>
                      <button
                        onClick={() => {
                          setThumbnail(null);
                          setThumbnailPreview(null);
                        }}
                        className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-medium transition-colors"
                      >
                        Clear Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            {step > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            ) : (
              <div></div>
            )}

            <div>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 0 && (!course || !semester || branch.length === 0 || !regulation)) ||
                    (step === 1 && (!subject || !topic || !unit)) ||
                    (step === 2 && (!videoName || !description))
                  }
                  className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!thumbnail}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Content
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadContent;