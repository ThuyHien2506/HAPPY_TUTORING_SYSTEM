package com.project.happy.service.scheduling;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import com.project.happy.dto.freeslot.FreeSlotResponse;
import com.project.happy.entity.Appointment;
import com.project.happy.entity.Meeting;
import com.project.happy.entity.MeetingStatus;
// ❌ Xóa import com.project.happy.entity.TutorSlot; 

import com.project.happy.repository.MeetingRepository;
import com.project.happy.service.freeslot.IFreeSlotService;

@Service
public class StudentSchedulingService implements IStudentSchedulingService {

    @Autowired
    private MeetingRepository meetingRepo;

    @Autowired
    private IFreeSlotService freeSlotService;

    public StudentSchedulingService(MeetingRepository meetingRepo, IFreeSlotService freeSlotService) {
        this.meetingRepo = meetingRepo;
        this.freeSlotService = freeSlotService;
    }

    @Override
    @Transactional // 💡 THÊM TRANSACTION: Đảm bảo cả 2 thao tác (Tạo hẹn và Cắt slot) đều thành công
    public boolean bookAppointment(Long studentId, Long tutorId, LocalDateTime date,
            LocalDateTime startTime, LocalDateTime endTime, String topic) {

        // 1. QUAN TRỌNG: Gọi sang FreeSlotService để CẮT SLOT RẢNH VÀ KIỂM TRA TÍNH KHẢ DỤNG
        // Logic kiểm tra slot có tồn tại và còn AVAILABLE hay không NÊN nằm trong freeSlotService.reserveSlot.
        // Nếu slot không tồn tại, reserveSlot sẽ ném ra ngoại lệ (IllegalArgumentException/RuntimeException).
        
        try {
            freeSlotService.reserveSlot(tutorId, startTime.toLocalDate(), startTime.toLocalTime(),
                    endTime.toLocalTime());
        } catch (IllegalArgumentException e) {
            // Nếu slot không còn rảnh (reserveSlot ném lỗi), ta ném lỗi lại cho Controller
            throw new IllegalArgumentException(
                    "Rất tiếc, khung giờ " + startTime.toLocalTime() + " - " + endTime.toLocalTime() 
                    + " không có sẵn hoặc đã được đặt. Vui lòng chọn khung giờ khác.");
        } catch (Exception e) {
             System.err.println("Lỗi khi cắt lịch rảnh: " + e.getMessage());
             throw new RuntimeException("Đặt lịch thất bại do lỗi hệ thống khi xử lý slot rảnh.");
        }
        
        // 2. Tạo và Lưu cuộc hẹn (Chỉ thực hiện nếu reserveSlot thành công)
        Appointment appointment = new Appointment(
                System.currentTimeMillis(),
                tutorId,
                studentId,
                startTime,
                endTime,
                topic);

        meetingRepo.save(appointment);
        
        return true;
    }

    // --- Hàm cancelMeeting (Giữ nguyên, logic releaseSlot vẫn đúng) ---
    @Override
    @Transactional // THÊM TRANSACTION CHO HÀM HỦY
    public boolean cancelMeeting(Long meetingId, String reason) {

        Meeting meeting = meetingRepo.findById(meetingId);
        if (meeting == null || meeting.isCancelled()) {
            return false;
        }

        boolean ok = meeting.cancel(reason);

        if (ok) {
            meetingRepo.update(meeting);

            // TRẢ LẠI SLOT RẢNH KHI HỦY
            try {
                freeSlotService.releaseSlot(
                        meeting.getTutorId(),
                        meeting.getStartTime().toLocalDate(),
                        meeting.getStartTime().toLocalTime(),
                        meeting.getEndTime().toLocalTime());
            } catch (Exception e) {
                System.err.println("Lỗi khi trả lịch rảnh: " + e.getMessage());
                // Không ném lỗi ra đây vì cuộc hẹn đã hủy thành công trong DB.
            }
        }

        return ok;
    }

    // --- Các hàm khác giữ nguyên logic ---

    @Override
    public List<FreeSlotResponse> viewTutorAvailableSlots(Long tutorId) {
        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        // Lấy slot tháng này (Gọi qua Service đểlấy List Available)
        List<FreeSlotResponse> thisMonth = freeSlotService.getMonthlySchedule(tutorId, currentMonth, currentYear);

        // Lấy slot tháng sau
        int nextMonth = (currentMonth == 12) ? 1 : currentMonth + 1;
        int nextYear = (currentMonth == 12) ? currentYear + 1 : currentYear;

        List<FreeSlotResponse> nextMonthSlots = freeSlotService.getMonthlySchedule(
                tutorId, nextMonth, nextYear);

        List<FreeSlotResponse> all = new ArrayList<>();
        all.addAll(thisMonth);
        all.addAll(nextMonthSlots);
        // Sắp xếp theo ngày
        all.sort(Comparator.comparing(FreeSlotResponse::getDate));

        return all;
    }
    
    @Override
    public List<Appointment> viewAppointmentHistory(Long studentId) {
        List<Appointment> list = meetingRepo.findAllAppointmentsByStudent(studentId);
        list.forEach(m -> m.updateStatus(LocalDateTime.now()));
        return list;
    }

    @Override
    public Meeting viewMeetingDetails(Long meetingId) {
        Meeting meeting = meetingRepo.findById(meetingId);
        if (meeting != null)
            meeting.updateStatus(LocalDateTime.now());
        return meeting;
    }

    @Override
    public List<Meeting> viewOfficialMeetings(Long studentId) {
        List<Meeting> list = meetingRepo.findOfficialMeetingsByStudent(studentId);
        list.forEach(m -> m.updateStatus(LocalDateTime.now()));
        return list;
    }

    @Override
    public List<Meeting> findCancellableMeetings(Long studentId) {
        List<Meeting> officialMeetings = meetingRepo.findOfficialMeetingsByStudent(studentId);
        LocalDateTime now = LocalDateTime.now();

        return officialMeetings.stream()
                .peek(m -> m.updateStatus(now))
                .filter(m -> !m.isCancelled()
                        && (m.getStatus() == MeetingStatus.SCHEDULED || m.getStatus() == MeetingStatus.ONGOING))
                .toList();
    }
}