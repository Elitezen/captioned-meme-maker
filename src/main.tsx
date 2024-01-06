import React from 'react'
import ReactDOM from 'react-dom/client'

import Home from './pages/Home.tsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Create from './pages/Create.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create",
    element: <Create />
  },
], { basename: '/captioned-meme-maker/' });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);