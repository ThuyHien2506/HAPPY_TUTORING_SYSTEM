import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterTutor.css';
import * as tutorService from '../../service/tutorService';
import Vectorimg from '../../assets/Vector.png';

function TutorCard({ tutor, onSelect }) {
  const avatarImages = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5'
  ];
  const avatarUrl = avatarImages[tutor.bkNetId.charCodeAt(tutor.bkNetId.length - 1) % avatarImages.length];
  
  return (
    <div className="tutor-card">
      <img src={avatarUrl} alt={tutor.fullName} className="tutor-avatar-img" />
      <div className="tutor-info">
        <div className="tutor-name">{tutor.fullName}</div>
        <div className="tutor-rating">★★★★★ 5.0</div>
        <div className="tutor-meta">
          <span>Có slot trống</span>
        </div>
      </div>
      <div>
        <button className="btn btn-select" onClick={() => onSelect(tutor)}>Chọn</button>
      </div>
    </div>
  );
}

export default function RegisterTutor() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showConfirmCancelPopup, setShowConfirmCancelPopup] = useState(false);
  const [showCancelSuccessPopup, setShowCancelSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasExistingTutor, setHasExistingTutor] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userBkNetId = user?.bkNetId || user?.id;
  const userFullName = user?.fullName || user?.name;

  // Load subjects and check existing tutor on mount
  useEffect(() => {
    loadSubjects();
    checkExistingTutor();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await tutorService.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Error loading subjects:', err);
      setError('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingTutor = async () => {
    try {
      const enrollments = await tutorService.getStudentEnrollments(userBkNetId);
      console.log('Student enrollments:', enrollments);
      if (enrollments && enrollments.length > 0) {
        setHasExistingTutor(true);
        setError(`Bạn đã có tutor: ${enrollments[0].tutorName} cho môn ${enrollments[0].subjectCode}`);
      }
    } catch (err) {
      console.error('Error checking existing tutor:', err);
    }
  };

  const onFindTutors = async () => {
    if (hasExistingTutor) {
      setError('Bạn đã có tutor rồi. Không thể đăng ký tutor mới');
      return;
    }

    if (!selectedSubject) {
      setError('Vui lòng chọn môn học');
      return;
    }

    try {
      setLoading(true);
      // Find the subject object to get ID
      const subjectObj = subjects.find(s => s.code === selectedSubject || s.name === selectedSubject);
      if (!subjectObj) {
        setError('Môn học không hợp lệ');
        return;
      }

      // Get tutors for this subject
      const data = await tutorService.getTutorsBySubject(subjectObj.id);
      setTutors(data);
      setShowSubjectDropdown(false);
      setPage(1);
      setStep(2);
      setError('');
    } catch (err) {
      console.error('Error finding tutors:', err);
      setError('Không thể tải danh sách giáo viên');
    } finally {
      setLoading(false);
    }
  };

  const onSelectSubject = (subject) => {
    setSelectedSubject(subject.code);
    setShowSubjectDropdown(false);
  };

  const onSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    setStep(3);
  };

  const onCancel = () => {
    setShowConfirmCancelPopup(true);
  };

  const onConfirmCancelYes = () => {
    setShowConfirmCancelPopup(false);
    setShowCancelSuccessPopup(true);
  };

  const onConfirmCancelNo = () => {
    setShowConfirmCancelPopup(false);
  };

  const onCancelSuccessConfirm = () => {
    setStep(1);
    setSelectedSubject('');
    setTutors([]);
    setSelectedTutor(null);
    setShowCountdown(false);
    setCountdown(10);
    setShowCancelSuccessPopup(false);
  };

  const onCancelSuccessBackToHome = () => {
    navigate('/student');
  };

  // Auto-start countdown when entering step 3
  useEffect(() => {
    if (step === 3 && !showCountdown) {
      setShowCountdown(true);
      setCountdown(10);
    }
  }, [step]);

  // Handle countdown timer
  useEffect(() => {
    if (!showCountdown) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      handleEnroll();
    }
  }, [showCountdown, countdown]);

  // Handle enrollment when countdown reaches 0
  const handleEnroll = async () => {
    try {
      setLoading(true);
      console.log('Starting enrollment...', { userBkNetId, selectedTutor, selectedSubject });
      
      const subjectObj = subjects.find(s => s.code === selectedSubject || s.name === selectedSubject);
      if (!subjectObj) {
        setError('Không tìm thấy môn học');
        setShowCountdown(false);
        setStep(1);
        return;
      }

      console.log('Subject found:', subjectObj);

      // Check if already enrolled
      const enrolled = await tutorService.checkEnrollment(userBkNetId, subjectObj.id);
      console.log('Enrollment check result:', enrolled);
      
      if (enrolled.enrolled) {
        setError('Bạn đã đăng ký với giáo viên này rồi');
        setShowCountdown(false);
        setStep(1);
        return;
      }

      console.log('Enrolling student...');
      // Enroll student
      const result = await tutorService.enrollStudent(userBkNetId, selectedTutor.bkNetId, subjectObj.id);
      console.log('Enrollment result:', result);
      
      setStep(4);
      setShowCountdown(false);
      setError('');
      setHasExistingTutor(true);
    } catch (err) {
      console.error('Error enrolling:', err);
      if (err.response?.status === 400) {
        setError('Bạn đã đăng ký với giáo viên cho môn học này rồi');
      } else {
        setError('Đã xảy ra lỗi khi đăng ký: ' + (err.message || ''));
      }
      setShowCountdown(false);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // pagination helpers for step 2
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(tutors.length / pageSize));
  const visibleTutors = tutors.slice((page - 1) * pageSize, page * pageSize);

  if (!userBkNetId) {
    return (
      <div className="register-root">
        <div className="card shifted">
          <div className="error-message">Vui lòng đăng nhập trước khi đăng ký giáo viên</div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-root">
      <div className="steps-header">
        <div className="back-area">
          <button className="back-link" onClick={() => { if (step > 1) setStep(step - 1); else navigate(-1); }}>
            « Quay lại
          </button>
        </div>
      </div>

      <div className="steps-row">
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="circle">1</div>
            <small>Nhập thông tin</small>
          </div>
          <div className={`connector ${step > 1 ? 'active' : ''}`} />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="circle">2</div>
            <small>Chọn tutor</small>
          </div>
          <div className={`connector ${step > 2 ? 'active' : ''}`} />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="circle">3</div>
            <small>Xác nhận</small>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <div className="card shifted">
          <h3>Đăng ký Tutor</h3>
          {hasExistingTutor ? (
            <div className="info-box">
              <p>Bạn đã có tutor rồi. Không thể đăng ký tutor mới</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/student')}
              >
                Quay về trang chủ
              </button>
            </div>
          ) : (
            <>
              <label>Chọn môn / lĩnh vực</label>
              <div className="subject-row" style={{ position: 'relative' }}>
                <input 
                  value={selectedSubject} 
                  onChange={e => setSelectedSubject(e.target.value)} 
                  placeholder="Ví dụ: Lập trình Java"
                  disabled={loading}
                />
                <button 
                  className="icon-arrow" 
                  title="Chọn môn" 
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                >
                  ▼
                </button>
                {showSubjectDropdown && (
                  <div className="subject-dropdown">
                    {loading ? (
                      <div className="dropdown-item">Đang tải...</div>
                    ) : subjects.length === 0 ? (
                      <div className="dropdown-item">Không có môn học</div>
                    ) : (
                      subjects.map(s => (
                        <div 
                          key={s.id} 
                          className="dropdown-item" 
                          onClick={() => onSelectSubject(s)}
                        >
                          {s.code} - {s.name}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="actions">
                <button 
                  className="btn btn-primary" 
                  onClick={onFindTutors}
                  disabled={loading || !selectedSubject}
                >
                  Tiếp theo
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="card shifted">
          <div className="tutor-grid-container">
            {loading ? (
              <div>Đang tải danh sách giáo viên...</div>
            ) : tutors.length === 0 ? (
              <div>Không có giáo viên nào dạy môn học này</div>
            ) : (
              <>
                <div className="tutor-grid">
                  {visibleTutors.map(t => (
                    <div key={t.id} className="background-border">
                      <div className="container">
                        <div className="link">
                          <div className="course" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80)` }} />
                        </div>
                        <div className="background">
                          <div className="text-wrapper">{t.bkNetId}</div>
                        </div>
                      </div>

                      <div className="symbol">★★★★★</div>
                      <div className="div">5.0</div>

                      <div className="paragraph-background">
                        <div className="symbol-2"></div>
                        <div className="hk">Tutor</div>
                        <div className="symbol-3"></div>
                        <div className="text-wrapper-2">Sinh viên</div>
                      </div>

                      <div className="image" style={{ backgroundImage: `url(https://i.pravatar.cc/150?img=${t.id % 5})` }} />
                      <div className="text-wrapper-3">{t.fullName}</div>

                      <button className="link-2" onClick={() => onSelectTutor(t)}>
                        <div className="text-wrapper-4">Enroll</div>
                        <div className="SVG">
                          <div className="arrow">→</div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {tutors.length > 0 && (
                  <div className="pagination-controls">
                    <div className="pagination-dots">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`pagination-dot ${page === i + 1 ? 'active' : ''}`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {step === 3 && selectedTutor && (
        <div className="confirmation-container">
          <div className="confirmation-border">
            <div className="confirmation-background">
              <div className="confirmation-icon">
                <img className="vector-img" src={Vectorimg} alt="Success Icon" />
              </div>
              <div className="confirmation-border-dash" />
            </div>

            <div className="confirmation-heading">
              ĐANG CHỜ DUYỆT ĐĂNG KÝ
            </div>

            <div className="confirmation-content">
              <div className="course-title">
                {selectedSubject}
              </div>

              <div className="student-info">
                <div className="info-item"><strong>Sinh viên:</strong> {userFullName}</div>
                <div className="info-item"><strong>MSSV:</strong> {userBkNetId}</div>
                <div className="info-item"><strong>Tutor:</strong> {selectedTutor.fullName}</div>
              </div>

              <div className="note-section">
                <div className="note-title">LƯU Ý</div>
                <div className="note-content">
                  Yêu cầu sẽ ở trạng thái "Chờ duyệt" nếu Tutor cần xác nhận.
                  <br />
                  Hủy trước 12 giờ để không mất slot.
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn-cancel" onClick={onCancel} disabled={loading}>
                  Hủy đăng ký
                </button>
              </div>

              {showCountdown && (
                <div className="countdown-info">
                  Xác nhận tự động trong <strong>{countdown}</strong> giây
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="confirmation-container">
          <div className="confirmation-border success-border">
            <div className="confirmation-background success-background">
              <div className="confirmation-icon">
                <img className="vector-img" src={Vectorimg} alt="Success Icon" />
              </div>
              <div className="confirmation-border-dash" />
            </div>

            <div className="confirmation-heading success-heading">
              HỆ THỐNG XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG
            </div>

            <div className="confirmation-content">
              <div className="course-title">
                {selectedSubject}
              </div>

              <div className="student-info">
                <div className="info-item"><strong>Sinh viên:</strong> {userFullName}</div>
                <div className="info-item"><strong>MSSV:</strong> {userBkNetId}</div>
                <div className="info-item"><strong>Tutor:</strong> {selectedTutor?.fullName}</div>
              </div>

              <div className="note-section">
                <div className="note-title">LƯU Ý</div>
                <div className="note-content">
                  Yêu cầu sẽ ở trạng thái "Chờ duyệt" nếu Tutor cần xác nhận.
                  <br />
                  Hủy trước 12 giờ để không mất slot.
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn-confirm success-btn" onClick={() => navigate('/student')}>
                  Quay về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmCancelPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2 className="popup-title">Bạn có chắc chắn muốn hủy đăng kí không ?</h2>
            <div className="popup-actions">
              <button className="popup-btn popup-btn-secondary" onClick={onConfirmCancelNo}>
                Hủy
              </button>
              <button className="popup-btn popup-btn-primary" onClick={onConfirmCancelYes}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">
              <div className="checkmark-icon">✓</div>
            </div>
            <h2 className="popup-title">Hủy đăng kí thành công</h2>
            <div className="popup-actions">
              <button className="popup-btn popup-btn-secondary" onClick={onCancelSuccessBackToHome}>
                Quay về trang chủ
              </button>
              <button className="popup-btn popup-btn-primary" onClick={onCancelSuccessConfirm}>
                Đăng ký mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
