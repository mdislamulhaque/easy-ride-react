import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/homePage/HomePage";
import Policy from "../pages/policy/Policy";
import CarBookingPage from "../pages/carBookingPage/CarBooking";
import MyReservation from "../pages/myReservation/MyReservation";
import CheckoutPage from "../pages/checkoutPage/CheckOutPage";
import AllOfferPage from "../pages/AllOfferPage/AllOfferPage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/policy",
        element: <Policy />,
      },
      {
        path: "/all-offers",
        element: <AllOfferPage />,
      },
      {
        path: "/booking/:id",
        element: <CarBookingPage />,
      },
      {
        path: "/reservation",
        element: <MyReservation />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },

      {
        path: "/*",
        element: <h1>404 - Page Not Found</h1>,
      },
    ],
  },
]);

export default router;
