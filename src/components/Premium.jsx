import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error("Error verifying premium user:", err.message);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const res = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { id: sessionId } = res.data;

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Stripe checkout error:", err.message);
    }
  };

  if (isUserPremium) {
    return (
      <div className="text-center m-10 text-xl font-semibold text-green-600">
        🎉 You're already a premium user!
      </div>
    );
  }

  return (
    <div className="m-10">
      <div className="flex flex-col md:flex-row w-full gap-6">
        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center p-6 shadow-md">
          <h1 className="font-bold text-3xl mb-2">Silver Membership</h1>
          <ul className="text-left mb-4">
            <li>✔️ Chat with other developers</li>
            <li>✔️ 100 connection requests per day</li>
            <li>✔️ Blue Tick</li>
            <li>✔️ Valid for 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-secondary"
          >
            Buy Silver
          </button>
        </div>

        <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center p-6 shadow-md">
          <h1 className="font-bold text-3xl mb-2">Gold Membership</h1>
          <ul className="text-left mb-4">
            <li>✔️ Unlimited connection requests</li>
            <li>✔️ Chat with other developers</li>
            <li>✔️ Blue Tick</li>
            <li>✔️ Valid for 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
