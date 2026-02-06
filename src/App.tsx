import { useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import BiblicalLifeDashboard from "./pages/bible_life_dashboard";
import JournalPage from "./pages/JournalPage";
import JournalCategoryPage from "./pages/JournalCategoryPage";
import { getUserSettings } from "./db";

function AppThemeInit() {
    useEffect(() => {
        getUserSettings().then((s) => {
            const dark = s?.isDarkMode ?? window.matchMedia("prefers-color-scheme: dark").matches;
            if (dark) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
        });
    }, []);
    return null;
}

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
        <>
            <AppThemeInit />
            <RouterProvider router={router} />
        </>
    );
}

export default App