import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/homePage/HomePage";
import Policy from "../pages/policy/Policy";



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
        element: <Policy />
      },
    
      {
        path: "/*",
        element: <h1>404 - Page Not Found</h1>,
      },
    ],
  },

  
]);

export default router;
