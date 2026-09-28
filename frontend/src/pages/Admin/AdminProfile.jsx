import "./AdminProfile.css";
import { User, Camera } from "lucide-react";

export default function AdminProfile() {
  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>👤 Admin Profile</h1>
        <p>Manage your account information and security settings.</p>
      </div>

      <div className="profile-card">

        {/* Profile Image */}

        <div className="profile-image-section">

          <div className="profile-image">
            <User size={70} />
          </div>

          <button className="change-photo-btn">
            <Camera size={16} />
            Change Photo
          </button>

        </div>

        {/* Personal Information */}

        <div className="form-section">

          <h2>Personal Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                defaultValue="John Smith"
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                defaultValue="admin"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                defaultValue="admin@company.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                defaultValue="+1 9876543210"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value="Administrator"
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Account Status</label>
              <input
                type="text"
                value="Active"
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Last Login</label>
              <input
                type="text"
                value="30 Jul 2026 10:45 AM"
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Created Date</label>
              <input
                type="text"
                value="15 Jan 2026"
                readOnly
              />
            </div>

          </div>

        </div>

        {/* Password */}

        <div className="form-section">

          <h2>Change Password</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Current Password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="New Password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
              />
            </div>

          </div>

        </div>

        <div className="button-group">
          <button className="save-btn">
            Save Changes
          </button>

          <button className="reset-btn">
            Reset
          </button>
        </div>

      </div>

    </div>
  );
}