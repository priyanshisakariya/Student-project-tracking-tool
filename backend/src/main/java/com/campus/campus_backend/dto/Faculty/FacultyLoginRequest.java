package com.campus.campus_backend.dto.Faculty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class FacultyLoginRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    private String password;


    public FacultyLoginRequest() {
    }


    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
