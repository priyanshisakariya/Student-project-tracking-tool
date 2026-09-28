package com.campus.campus_backend.dto.adminLogin;

public class ResetPasswordRequestDTO {

    private String name;
    private String newPassword;

    public ResetPasswordRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}