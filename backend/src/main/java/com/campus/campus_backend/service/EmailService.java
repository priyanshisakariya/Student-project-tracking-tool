package com.campus.campus_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@campusproject.com}")
    private String senderEmail;

    static {
        // Prevent Java from caching negative/failed DNS lookups so transient Wi-Fi drops recover immediately
        try {
            java.security.Security.setProperty("networkaddress.cache.negative.ttl", "0");
            java.security.Security.setProperty("networkaddress.cache.ttl", "60");
        } catch (Exception ignored) {
        }
    }

    private String lastError;

    public String getLastError() {
        return lastError;
    }

    /**
     * Sends an HTML formatted OTP verification email to the student's Gmail/email address.
     * Includes automatic retry on transient DNS / network connection timeouts.
     *
     * @param toEmail     The recipient's email address
     * @param studentName The recipient's full name (if available)
     * @param otp         The 6-digit OTP code
     * @return true if email was dispatched successfully, false otherwise.
     */
    public boolean sendOtpEmail(String toEmail, String studentName, String otp) {
        String displayName = (studentName != null && !studentName.trim().isEmpty())
                ? studentName.trim()
                : "Student";

        String subject = "Your CampusProject Login OTP: " + otp;

        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'></head>"
                + "<body style='margin:0; padding:24px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;'>"
                + "  <table width='100%' border='0' cellspacing='0' cellpadding='0'>"
                + "    <tr>"
                + "      <td align='center'>"
                + "        <table width='540' border='0' cellspacing='0' cellpadding='0' style='background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.07); border:1px solid #e2e8f0;'>"
                + "          <!-- Header -->"
                + "          <tr>"
                + "            <td style='background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 26px 30px; text-align: center; color: #ffffff;'>"
                + "              <h1 style='margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;'>CampusProject</h1>"
                + "              <p style='margin: 5px 0 0 0; font-size: 13.5px; opacity: 0.9;'>Student Project Management Portal</p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Body -->"
                + "          <tr>"
                + "            <td style='padding: 30px;'>"
                + "              <h2 style='margin-top: 0; color: #0f172a; font-size: 18px;'>Hello, " + displayName + "!</h2>"
                + "              <p style='font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;'>"
                + "                We received a request to log into your CampusProject account using One-Time Password (OTP) verification."
                + "              </p>"
                + "              <!-- OTP BOX -->"
                + "              <div style='background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;'>"
                + "                <span style='display: block; font-size: 12.5px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;'>Your Verification Code</span>"
                + "                <div style='font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; font-family: monospace;'>" + otp + "</div>"
                + "                <span style='display: block; font-size: 12px; color: #64748b; margin-top: 8px;'>⏱️ Valid for <strong>5 minutes</strong> only</span>"
                + "              </div>"
                + "              <!-- Security Note -->"
                + "              <div style='background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 20px 0;'>"
                + "                <p style='margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;'>"
                + "                  🔒 <strong>Security Notice:</strong> Never share this OTP with anyone. College faculty and administrators will never ask for your OTP."
                + "                </p>"
                + "              </div>"
                + "              <p style='font-size: 13.5px; color: #64748b; line-height: 1.5; margin: 20px 0 0 0;'>"
                + "                If you did not request this OTP code, someone may be trying to access your account. Please log in and verify your password immediately."
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Footer -->"
                + "          <tr>"
                + "            <td style='background-color: #f8fafc; padding: 16px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;'>"
                + "              &copy; 2026 CampusProject Platform &bull; All Rights Reserved"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";

        this.lastError = null;

        if (mailSender == null) {
            this.lastError = "JavaMailSender is not initialized. Please verify spring-boot-starter-mail dependency.";
            System.err.println("[EMAIL SERVICE] " + this.lastError);
            return false;
        }

        // Retry loop: Try up to 2 times to handle transient Wi-Fi/DNS hiccups
        int maxAttempts = 2;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(senderEmail, "CampusProject Portal");
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);

                System.out.println("==================================================");
                System.out.println("[EMAIL SERVICE] ✅ OTP successfully delivered to Gmail inbox: " + toEmail + (attempt > 1 ? " (after retry)" : ""));
                System.out.println("==================================================");
                return true;
            } catch (Exception e) {
                this.lastError = e.getMessage();
                System.err.println("[EMAIL SERVICE] ⚠️ Attempt " + attempt + " failed for " + toEmail + ": " + e.getMessage());

                // If first attempt failed, wait 1.2s before retry
                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(1200);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        System.err.println("[EMAIL SERVICE] ❌ All attempts exhausted for " + toEmail + ". Reason: " + this.lastError);
        return false;
    }
}
