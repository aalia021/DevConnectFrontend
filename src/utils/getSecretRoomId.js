import SHA256 from "crypto-js/sha256";

export const getSecretRoomId = (userId1, userId2) => {
  const sorted = [userId1, userId2].sort().join("$");
  return SHA256(sorted).toString();
};
