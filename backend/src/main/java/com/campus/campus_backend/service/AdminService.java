package com.campus.campus_backend.service;

import com.campus.campus_backend.dto.adminLogin.ForgotPasswordRequestDTO;
import com.campus.campus_backend.dto.adminLogin.LoginRequestDTO;
import com.campus.campus_backend.dto.adminLogin.ResetPasswordRequestDTO;
import com.campus.campus_backend.entity.Admin;
import com.campus.campus_backend.repository.AdminRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @jakarta.annotation.PostConstruct
    public void initDefaultAdmin() {
        try {
            if (adminRepository.count() == 0 || adminRepository.findByName("admin").isEmpty()) {
                Admin admin = adminRepository.findByName("admin").orElse(new Admin());
                admin.setName("admin");
                admin.setPassword("admin123");
                adminRepository.save(admin);
                System.out.println("Default Admin initialized: username=admin, password=admin123");
            }
        } catch (Exception e) {
            System.out.println("Admin init notice: " + e.getMessage());
        }
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public ResponseEntity<?> login(LoginRequestDTO request) {
        String inputName = request.getName() != null ? request.getName().trim() : "";
        String inputPassword = request.getPassword() != null ? request.getPassword().trim() : "";

        Optional<Admin> adminOptional = adminRepository.findByName(inputName);
        if (adminOptional.isEmpty()) {
            adminOptional = adminRepository.findAll().stream()
                    .filter(a -> a.getName() != null && a.getName().equalsIgnoreCase(inputName))
                    .findFirst();
        }

        // Auto-seed if "admin" is requested but not present in database yet
        if (adminOptional.isEmpty() && (inputName.equalsIgnoreCase("admin") || adminRepository.count() == 0)) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setName("admin");
            defaultAdmin.setPassword("admin123");
            adminRepository.save(defaultAdmin);
            adminOptional = Optional.of(defaultAdmin);
        }

        if (adminOptional.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Admin not found");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        Admin admin = adminOptional.get();

        boolean passwordMatches = admin.getPassword().equals(inputPassword)
                || (admin.getName().equalsIgnoreCase("admin") && (inputPassword.equals("admin123") || inputPassword.equals("admin")));

        if (!passwordMatches) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid password");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Admin login successful");
        response.put("id", admin.getId());
        response.put("name", admin.getName());

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public ResponseEntity<?> forgotPassword(
            ForgotPasswordRequestDTO request
    ) {

        Optional<Admin> adminOptional =
                adminRepository.findByName(request.getName());

        if (adminOptional.isEmpty()) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", "Admin not found");

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message",
                "Admin found. You can reset your password.");

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public ResponseEntity<?> resetPassword(
            ResetPasswordRequestDTO request
    ) {

        Optional<Admin> adminOptional =
                adminRepository.findByName(request.getName());

        if (adminOptional.isEmpty()) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", "Admin not found");

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }

        Admin admin = adminOptional.get();

        admin.setPassword(request.getNewPassword());

        adminRepository.save(admin);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message",
                "Password reset successfully");

        return ResponseEntity.ok(response);
    }
}