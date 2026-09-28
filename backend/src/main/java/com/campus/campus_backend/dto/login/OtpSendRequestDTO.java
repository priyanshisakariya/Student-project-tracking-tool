package com.campus.campus_backend.dto.login;

public class OtpSendRequestDTO {
    private String email;

    public OtpSendRequestDTO() {
    }

    public OtpSendRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
