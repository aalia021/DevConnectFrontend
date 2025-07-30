import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Failed to review request", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <h1 className="text-white text-xl mt-10 text-center">
        No Requests Found
      </h1>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-6">
        Connection Requests
      </h1>

      {/* List */}
      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const {
            _id: requestId,
            fromUserId: {
              _id,
              firstName,
              lastName,
              photoUrl,
              age,
              gender,
              about,
            },
          } = request;

          return (
            <div
              key={requestId}
              className="bg-base-300 border-2 border-white p-4 rounded-xl shadow-md flex items-center gap-6"
            >
              {/* Image */}
              <img
                src={photoUrl || "/default-avatar.png"}
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />

              {/* Details */}
              <div className="flex-1 text-left">
                <h2 className="text-xl font-semibold text-white">
                  {firstName} {lastName}
                </h2>

                {(age || gender) && (
                  <p className="text-sm text-gray-400 mb-1">
                    {age && `${age} years old`}
                    {age && gender && " • "}
                    {gender}
                  </p>
                )}

                {about && (
                  <p className="text-sm text-gray-300 italic">“{about}”</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => reviewRequest("rejected", requestId)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => reviewRequest("accepted", requestId)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
