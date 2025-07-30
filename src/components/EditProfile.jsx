import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const initialData = {
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    photoUrl: user.photoUrl || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    skills: user.skills || "", // assume it's a string, e.g., "React, Node"
    email: user.emailId || "",
  };

  const [formData, setFormData] = useState(initialData);
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
    setIsChanged(changed);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setError("");
    try {
      const [firstName, ...rest] = formData.fullName.trim().split(" ");
      const lastName = rest.join(" ") || "";

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl: formData.photoUrl,
          age: formData.age,
          gender: formData.gender,
          about: formData.about,
          skills: formData.skills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 my-10 px-4">
        <div className="w-full max-w-xl bg-base-300 rounded-2xl shadow-xl p-8 min-h-[650px] border-2 border-white">
          <h2 className="text-xl font-semibold text-center mb-4">
            Edit Profile
          </h2>
          <div className="space-y-4">
            {/* Full Name */}
            <label className="form-control w-full">
              <span className="label-text mb-1">Full Name</span>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled
                className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
              />
            </label>

            {/* Email (disabled) */}
            <label className="form-control w-full">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                value={formData.email}
                disabled
                className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
              />
            </label>

            {/* Photo URL */}
            <label className="form-control w-full">
              <span className="label-text mb-1">Photo URL</span>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => handleChange("photoUrl", e.target.value)}
                className="input input-bordered w-full"
              />
            </label>

            {/* Age */}
            <label className="form-control w-full">
              <span className="label-text mb-1">Age</span>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="input input-bordered w-full"
              />
            </label>

            {/* Gender */}
            <div className="form-control">
              <span className="label-text mb-1">Gender</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="radio radio-primary"
                  />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="radio radio-primary"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* About */}
            <label className="form-control w-full">
              <span className="label-text mb-1">About</span>
              <textarea
                value={formData.about}
                onChange={(e) => handleChange("about", e.target.value)}
                className="textarea textarea-bordered w-full"
              ></textarea>
            </label>

            {/* Skills */}
            <label className="form-control w-full">
              <span className="label-text mb-1">Skills (comma-separated)</span>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                className="input input-bordered w-full"
              />
            </label>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Save Button */}
            <div className="flex justify-center mt-4">
              <button
                className="btn btn-primary w-full"
                onClick={saveProfile}
                disabled={!isChanged}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <UserCard
          user={{
            firstName: formData.fullName.split(" ")[0],
            lastName: formData.fullName.split(" ").slice(1).join(" "),
            photoUrl: formData.photoUrl,
            age: formData.age,
            gender: formData.gender,
            about: formData.about,
            skills: formData.skills,
          }}
        />
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
