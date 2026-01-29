import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import BiblicalLifeDashboard from "./pages/bible_life_dashboard";
import JournalPage from "./pages/JournalPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <BiblicalLifeDashboard />,
    },
    {
        path: "/journal",
        element: <JournalPage />,
    },
    {
        path: "*",
        element: <BiblicalLifeDashboard />,
    },
]);

function App() {

    return (
        <RouterProvider router={router} />
    )
}

export default App