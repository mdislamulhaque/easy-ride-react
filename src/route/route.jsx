import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/homePage/HomePage";
import Policy from "../pages/policy/Policy";
import CarRentalPage from "../pages/rentCarPage/CarRentalPage";
import CarBookingPage from "../pages/carBookingPage/CarBooking";
import MyReservation from "../pages/myReservation/MyReservation";
import CheckoutPage from "../pages/checkoutPage/CheckOutPage";



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
        path: "/rent-a-car",
        element: <CarRentalPage />,
      },
      {
        path: "/car-booking",
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
