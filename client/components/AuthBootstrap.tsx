import { useEffect } from "react";
import { initializeAuth, subscribeToAuth } from "@/lib/auth";
import { claimGuestOrders } from "@/lib/orders";
import { syncWishlist } from "@/lib/wishlist";

const AuthBootstrap = () => {
  useEffect(() => {
    const syncCustomerData = (user: { id: string } | null) => { if (user) { void claimGuestOrders(user.id); void syncWishlist(); } };
    void initializeAuth().then(syncCustomerData);
    return subscribeToAuth(syncCustomerData);
  }, []);

  return null;
};

export default AuthBootstrap;
