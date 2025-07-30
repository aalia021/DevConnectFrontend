import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections?.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const aboutText = c.about?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      aboutText.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-6">Connections</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or about..."
        className="input input-bordered w-full mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* No Results */}
      {filteredConnections?.length === 0 && (
        <p className="text-white text-lg">No matches found.</p>
      )}

      {/* List of Connections */}
      <div className="flex flex-col gap-4">
        {filteredConnections?.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="bg-base-300 border-2 border-white p-4 rounded-xl shadow-md flex items-center gap-6"
            >
              {/* Image */}
              <img
                src={photoUrl || "/default-avatar.png"}
                alt="User"
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />

              {/* Details */}
              <div className="flex-1">
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

              {/* Chat Button */}
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary btn-sm">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
