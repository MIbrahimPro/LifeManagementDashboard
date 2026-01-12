import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import BiblicalLifeDashboard from "./pages/bible_life_dashboard";

const router = createBrowserRouter([
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