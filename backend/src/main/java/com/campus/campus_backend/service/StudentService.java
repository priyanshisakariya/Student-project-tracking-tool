package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.login.LoginRequestDTO;
import com.campus.campus_backend.dto.login.LoginResponseDTO;
import com.campus.campus_backend.dto.profile.StudentProfileRequestDTO;
import com.campus.campus_backend.dto.profile.StudentProfileResponseDTO;
import com.campus.campus_backend.dto.student.StudentRegisterDTO;
import com.campus.campus_backend.dto.studentAdminDTO.StudentDTO;
import com.campus.campus_backend.entity.StudentProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.campus_backend.entity.Student;
import com.campus.campus_backend.repository.StudentRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;


    // Registration
    public Student registerStudent(StudentRegisterDTO requestDTO) {

        if (requestDTO == null) {
            throw new IllegalArgumentException("Registration request data cannot be empty.");
        }

        // Full Name validation
        if (requestDTO.getFullName() == null || requestDTO.getFullName().trim().length() < 3) {
            throw new IllegalArgumentException("Full name must be at least 3 characters long.");
        }

        // Email validation
        if (requestDTO.getEmail() == null || requestDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required.");
        }
        String cleanEmail = requestDTO.getEmail().trim().toLowerCase();
        if (!cleanEmail.matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$")) {
            throw new IllegalArgumentException("Please enter a valid email address.");
        }
        if (cleanEmail.endsWith(".coom") || cleanEmail.endsWith(".comm") || cleanEmail.endsWith(".con") || cleanEmail.endsWith(".cmo")) {
            throw new IllegalArgumentException("Invalid email domain extension. Did you mean '.com'?");
        }
        if (cleanEmail.contains("@gmail.") && !cleanEmail.endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Gmail addresses must end with @gmail.com.");
        }

        // Mobile Number validation (exactly 10 digits)
        if (requestDTO.getMobileNo() == null || !requestDTO.getMobileNo().trim().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits.");
        }

        // Password validation
        if (requestDTO.getPassword() == null || requestDTO.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        // Enrollment Number validation
        if (requestDTO.getEnrollmentNo() == null || requestDTO.getEnrollmentNo().trim().isEmpty()) {
            throw new IllegalArgumentException("Enrollment number is required.");
        }

        if (studentRepository.existsByEmail(requestDTO.getEmail().trim())) {
            throw new IllegalArgumentException("This Email ID is already registered! Please use another email or log in.");
        }

        if (studentRepository.existsByEnrollmentNo(requestDTO.getEnrollmentNo().trim())) {
            throw new IllegalArgumentException("This Enrollment Number is already registered! Please check your enrollment number.");
        }

        Student student = new Student();

        student.setFullName(requestDTO.getFullName() != null ? requestDTO.getFullName().trim() : "");
        student.setEmail(requestDTO.getEmail() != null ? requestDTO.getEmail().trim() : "");
        student.setPassword(requestDTO.getPassword());
        student.setEnrollmentNo(requestDTO.getEnrollmentNo() != null ? requestDTO.getEnrollmentNo().trim() : "");
        student.setDepartment(requestDTO.getDepartment());
        student.setMobileNo(requestDTO.getMobileNo());
        student.setSem(requestDTO.getSem());
        student.setAcademicYear(requestDTO.getAcademicYear());

        return studentRepository.save(student);
    }


    // Login
    public LoginResponseDTO loginStudent(LoginRequestDTO requestDTO) {

        Optional<Student> optionalStudent =
                studentRepository.findByEmail(requestDTO.getEmail());

        // 2. Check if student exists
        if (optionalStudent.isEmpty()) {
            throw new RuntimeException("Email not found");
        }

        // 3. Get student object
        Student student = optionalStudent.get();

        // 4. Compare password
        if (!student.getPassword().equals(requestDTO.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 5. Create Response DTO
        LoginResponseDTO responseDTO = new LoginResponseDTO();

        responseDTO.setId(student.getId());
        responseDTO.setFullName(student.getFullName());
        responseDTO.setEmail(student.getEmail());
        responseDTO.setMobileNo(student.getMobileNo());
        responseDTO.setEnrollmentNo(student.getEnrollmentNo());
        responseDTO.setDepartment(student.getDepartment());
        responseDTO.setSem(student.getSem());
        responseDTO.setAcademicYear(student.getAcademicYear());

        if (student.getStudentProfile() != null) {
            responseDTO.setAddress(student.getStudentProfile().getAddress());
            responseDTO.setDateOfBirth(student.getStudentProfile().getDateOfBirth());
            responseDTO.setSkills(student.getStudentProfile().getSkills());
            responseDTO.setLinkedInUrl(student.getStudentProfile().getLinkedInUrl());
        }

        responseDTO.setRole("STUDENT");

        // 6. Return Response DTO
        return responseDTO;
    }

    // =====================================================
    // OTP LOGIN IMPLEMENTATION
    // =====================================================

    private static class OtpData {
        private final String otp;
        private final long expiryTime;

        public OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    // In-memory cache for OTP storage (Email -> OtpData)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    // Send OTP
    public Map<String, Object> sendLoginOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required.");
        }

        String cleanEmail = email.trim().toLowerCase();

        // Check if student exists (case-insensitive & trimmed)
        Optional<Student> optionalStudent = studentRepository.findByEmailIgnoreCase(cleanEmail);
        if (optionalStudent.isEmpty()) {
            optionalStudent = studentRepository.findByEmail(cleanEmail);
        }
        if (optionalStudent.isEmpty()) {
            throw new RuntimeException("No student found with email: " + cleanEmail);
        }

        Student student = optionalStudent.get();

        // Generate 6-digit OTP
        int randomPin = 100000 + new Random().nextInt(900000);
        String otp = String.valueOf(randomPin);

        // Valid for 5 minutes (5 * 60 * 1000 ms)
        long expiry = System.currentTimeMillis() + (5 * 60 * 1000);
        otpStorage.put(cleanEmail, new OtpData(otp, expiry));

        // Dispatch OTP securely to student's Gmail
        boolean emailSent = emailService.sendOtpEmail(cleanEmail, student.getFullName(), otp);

        if (!emailSent) {
            String errorDetail = emailService.getLastError();
            if (errorDetail != null && errorDetail.toLowerCase().contains("authentication")) {
                throw new RuntimeException("Gmail SMTP Authentication failed. Please configure a 16-character Google App Password in application.properties (spring.mail.password).");
            }
            if (errorDetail != null && (errorDetail.toLowerCase().contains("unknownhost") || errorDetail.toLowerCase().contains("timeout") || errorDetail.toLowerCase().contains("couldn't connect") || errorDetail.toLowerCase().contains("connection failed"))) {
                throw new RuntimeException("Unable to connect to Gmail server due to network/DNS timeout. Please check your internet connection and try sending OTP again.");
            }
            throw new RuntimeException("Failed to deliver OTP to " + cleanEmail + ": " + (errorDetail != null ? errorDetail : "SMTP server unavailable."));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent successfully to your registered Gmail address. Please check your inbox!");
        response.put("email", cleanEmail);
        // Notice: OTP is deliberately excluded from response for robust security

        return response;
    }

    // Verify OTP & Login
    public LoginResponseDTO verifyLoginOtp(String email, String otp) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required.");
        }
        if (otp == null || otp.trim().isEmpty()) {
            throw new IllegalArgumentException("OTP is required.");
        }

        String cleanEmail = email.trim().toLowerCase();
        String cleanOtp = otp.trim();

        OtpData otpData = otpStorage.get(cleanEmail);

        if (otpData == null || otpData.isExpired()) {
            otpStorage.remove(cleanEmail);
            throw new RuntimeException("OTP has expired or is invalid. Please request a new OTP.");
        }

        if (!otpData.getOtp().equals(cleanOtp)) {
            throw new RuntimeException("Invalid OTP entered. Please check and try again.");
        }

        // OTP verified successfully - invalidate it
        otpStorage.remove(cleanEmail);

        // Fetch student
        Student student = studentRepository.findByEmailIgnoreCase(cleanEmail)
                .or(() -> studentRepository.findByEmail(cleanEmail))
                .orElseThrow(() -> new RuntimeException("Student not found."));

        // Build LoginResponseDTO
        LoginResponseDTO responseDTO = new LoginResponseDTO();
        responseDTO.setId(student.getId());
        responseDTO.setFullName(student.getFullName());
        responseDTO.setEmail(student.getEmail());
        responseDTO.setMobileNo(student.getMobileNo());
        responseDTO.setEnrollmentNo(student.getEnrollmentNo());
        responseDTO.setDepartment(student.getDepartment());
        responseDTO.setSem(student.getSem());
        responseDTO.setAcademicYear(student.getAcademicYear());

        if (student.getStudentProfile() != null) {
            responseDTO.setAddress(student.getStudentProfile().getAddress());
            responseDTO.setDateOfBirth(student.getStudentProfile().getDateOfBirth());
            responseDTO.setSkills(student.getStudentProfile().getSkills());
            responseDTO.setLinkedInUrl(student.getStudentProfile().getLinkedInUrl());
        }

        responseDTO.setRole("STUDENT");

        return responseDTO;
    }
    //edit profile
    public StudentProfileResponseDTO updateStudent(Integer id, StudentProfileRequestDTO requestDTO) {

        // Find student
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Update Student table
        student.setFullName(requestDTO.getFullName());
        student.setEmail(requestDTO.getEmail());
        student.setMobileNo(requestDTO.getMobileNo());
        student.setEnrollmentNo(requestDTO.getEnrollmentNo());
        student.setDepartment(requestDTO.getDepartment());
        student.setSem(requestDTO.getSem());


        // Create StudentProfile if it doesn't exist
        if (student.getStudentProfile() == null) {
            StudentProfile profile = new StudentProfile();
            profile.setStudent(student);
            student.setStudentProfile(profile);
        }

        // Update StudentProfile table
        student.getStudentProfile().setAddress(requestDTO.getAddress());
        student.getStudentProfile().setDateOfBirth(requestDTO.getDateOfBirth());
        student.getStudentProfile().setSkills(requestDTO.getSkills());
        student.getStudentProfile().setLinkedInUrl(requestDTO.getLinkedInUrl());


        // Save
        Student savedStudent = studentRepository.save(student);

        // Create Response DTO
        StudentProfileResponseDTO responseDTO = new StudentProfileResponseDTO();

        responseDTO.setId(savedStudent.getId());
        responseDTO.setFullName(savedStudent.getFullName());
        responseDTO.setEmail(savedStudent.getEmail());
        responseDTO.setMobileNo(savedStudent.getMobileNo());
        responseDTO.setEnrollmentNo(savedStudent.getEnrollmentNo());
        responseDTO.setDepartment(savedStudent.getDepartment());
        responseDTO.setSem(savedStudent.getSem());
        responseDTO.setAcademicYear(savedStudent.getAcademicYear());

        responseDTO.setAddress(savedStudent.getStudentProfile().getAddress());
        responseDTO.setDateOfBirth(savedStudent.getStudentProfile().getDateOfBirth());
        responseDTO.setSkills(savedStudent.getStudentProfile().getSkills());
        responseDTO.setLinkedInUrl(savedStudent.getStudentProfile().getLinkedInUrl());

        return responseDTO;
    }


    //submit proprsal
    public Student getStudentById(Integer id){

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getLatestStudent() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return null;
        }
        return students.get(students.size() - 1);
    }

    private StudentDTO convertToDTO(Student student) {

        StudentDTO dto = new StudentDTO();

        dto.setId(student.getId().longValue());

        dto.setName(student.getFullName());
//        dto.setEmail(student.getEmail());
        dto.setEnrollment(student.getEnrollmentNo());
//        dto.setDepartment(student.getDepartment());
//        dto.setMobileNo(student.getMobileNo());
//        dto.setSemester(student.getSem());
//        dto.setAcademicYear(student.getAcademicYear());

        /*
         * These values are not present in Student entity.
         * Therefore they are temporarily displayed as "-".
         *
         * Later we can fetch them from:
         * SubmitProposal
         * Faculty Allocation
         * Project/Progress table
         */

        dto.setProject("-");
        dto.setFaculty("-");
        dto.setStatus("Pending");

        return dto;
    }

    public Student updateStudent(Integer id, Student updatedStudent) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        existingStudent.setFullName(updatedStudent.getFullName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setEnrollmentNo(updatedStudent.getEnrollmentNo());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setMobileNo(updatedStudent.getMobileNo());
        existingStudent.setSem(updatedStudent.getSem());
        existingStudent.setAcademicYear(updatedStudent.getAcademicYear());

        return studentRepository.save(existingStudent);
    }
}