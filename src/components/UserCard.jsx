import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    email,
    skills,
  } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request failed", err);
    }
  };

  return (
    <div className="card w-full max-w-sm bg-base-300 shadow-xl border-2 border-white">
      {/* User Photo */}
      <figure>
        <img
          src={photoUrl || "/default-avatar.png"}
          alt="User Photo"
          className="w-full object-contain rounded-t-xl"
        />
      </figure>

      <div className="card-body items-center text-center">
        {/* Name */}
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {/* Age and Gender */}
        {(age || gender) && (
          <p className="text-sm text-gray-400">
            {age && `${age} years old`}
            {age && gender && " • "}
            {gender}
          </p>
        )}

        {/* Email */}
        {email && (
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Email: </span>
            {email}
          </p>
        )}

        {/* About */}
        {about && (
          <p className="mt-2 text-sm text-gray-200 italic">“{about}”</p>
        )}

        {/* Skills */}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {typeof skills === "string" && skills.trim() ? (
            skills.split(",").map((skill, index) => (
              <span
                key={index}
                className="badge badge-outline text-xs px-2 py-1"
              >
                {skill.trim()}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 italic">
              No skills added yet.
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions mt-4 justify-center">
          <button
            className="btn btn-error btn-sm"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
