import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import BiblicalLifeDashboard from "./pages/bible_life_dashboard";
import JournalPage from "./pages/JournalPage";
import JournalCategoryPage from "./pages/JournalCategoryPage";

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
        path: "/journal/:categoryId",
        element: <JournalCategoryPage />,
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