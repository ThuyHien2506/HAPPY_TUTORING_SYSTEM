import React, { useState, useEffect } from "react"; 
import avatarImg from "../../assets/avatar.svg";
import { useAuth } from "../../AuthContext";
import { getUserProfile } from "../../api/userApi"; 

const StudentProfile = () => {
  // Lấy user (chỉ để lấy ID cần thiết cho API)
  const { user } = useAuth();
  const userId = user?.id || user?.bkNetId; // Giả sử ID người dùng nằm trong user.id/user.bkNetId

  // 1. Khởi tạo State để lưu dữ liệu Profile và trạng thái
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    // Chỉ gọi API nếu có userId
    if (!userId) {
      setError("Không tìm thấy ID người dùng để tải hồ sơ.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // ⬅️ Gọi hàm API
        const data = await getUserProfile(userId); 
        setProfileData(data); // Lưu dữ liệu API vào state
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ:", err);
        setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
        setProfileData(null);
      } finally {
        setLoading(false); // Dù thành công hay thất bại cũng kết thúc loading
      }
    };

    fetchUserProfile();
  }, [userId]); // Dependency: Chỉ chạy lại khi userId thay đổi

  // 3. Xử lý trạng thái Loading (Đang tải)
  if (loading) {
    return <div className="student-page-inner">Đang tải hồ sơ...</div>;
  }

  // 4. Xử lý trạng thái Lỗi
  if (error) {
    return <div className="student-page-inner" style={{ color: 'red' }}>Lỗi: {error}</div>;
  }
  
  // 5. Nếu không có dữ liệu (và không lỗi/loading), có thể hiển thị thông báo
  if (!profileData) {
    return <div className="student-page-inner">Không có dữ liệu hồ sơ.</div>;
  }

  // 6. Sau khi tải thành công, sử dụng profileData thay vì user
  // Giả sử API trả về các trường tương tự như: name, studentId, department, email, phone
  
  // Tránh việc phải thay đổi quá nhiều tên biến trong JSX, ta đặt tên lại cho dễ dùng
  // Sửa đổi dòng này trong component StudentProfile
const { 
  // Lấy thuộc tính 'fullName' từ profileData và đặt tên biến là 'name'
  fullName: name,         
  // Lấy thuộc tính 'studentCode' từ profileData và đặt tên biến là 'studentId'
  studentCode: studentId, 
  // Lấy thuộc tính 'major' từ profileData và đặt tên biến là 'department'
  major: department,      
  // Hai thuộc tính này đã đúng tên và hiển thị
  email,
  phoneNumber 
} = profileData;

  return (
    <div className="student-page-inner">
      <div className="student-card profile-card">
        <div className="profile-left">
          {/* ... (Giữ nguyên phần avatar) */}
          <div className="profile-avatar-circle">
            <img src={avatarImg} alt="Avatar" className="profile-avatar-image" />
          </div>
          <div className="profile-name-block">
            <div className="profile-name">{name}</div> {/* ⬅️ Dùng name từ API */}
            <div className="profile-role">{user.role === "student" ? "S" : "T"}</div> 
            <button className="profile-btn">Thêm ảnh</button>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-row">
            <span className="profile-label">Họ và tên</span>
            <span className="profile-value">{name}</span> {/* ⬅️ Dùng name từ API */}
          </div>
          <div className="profile-row">
            <span className="profile-label">Mã số sinh viên</span>
            <span className="profile-value">{studentId}</span> {/* ⬅️ Dùng studentId từ API */}
          </div>
          <div className="profile-row">
            <span className="profile-label">Khoa/Bộ môn</span>
            <span className="profile-value">{department}</span> {/* ⬅️ Dùng department từ API */}
          </div>
          <div className="profile-row">
            <span className="profile-label">Chuyên ngành</span>
            <span className="profile-value">{department}</span> {/* ⬅️ Dùng department từ API */}
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{email}</span> {/* ⬅️ Dùng email từ API */}
          </div>
          <div className="profile-row">
            <span className="profile-label">Số điện thoại</span>
            <span className="profile-value">{phoneNumber}</span> {/* ⬅️ Dùng phoneNumber từ API */}
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default StudentProfile;