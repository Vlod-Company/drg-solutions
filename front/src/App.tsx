import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RequestsPage } from "./pages/RequestsPage";
import { MissionsPage } from "./pages/MissionsPage";
import { StationsPage } from "./pages/StationsPage";
import { BiomesPage } from "./pages/BiomesPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TeamsPage } from "./pages/TeamsPage";
import { LogisticsPage } from "./pages/LogisticsPage";
import { CargoPage } from "./pages/CargoPage";
import { Toaster } from "sonner@2.0.3";
import {StorePage} from "./pages/StorePage";
import {UsersPage} from "./pages/UsersPage";

function Router() {
    const { isAuthenticated } = useAuth();
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener("popstate", handlePopState);

        // Intercept link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const newPath = new URL(link.href).pathname;
                window.history.pushState({}, "", newPath);
                setCurrentPath(newPath);
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            document.removeEventListener("click", handleClick);
        };
    }, []);

    // Redirect to dashboard if authenticated and on login page
    useEffect(() => {
        if (isAuthenticated && currentPath === "/login") {
            window.history.pushState({}, "", "/dashboard");
            setCurrentPath("/dashboard");
        }
    }, [isAuthenticated, currentPath]);

    // Redirect to login if not authenticated
    if (!isAuthenticated && currentPath !== "/login") {
        return <LoginPage />;
    }

    // Route mapping
    switch (currentPath) {
        case "/login":
            return <LoginPage />;
        case "/dashboard":
            return <DashboardPage />;
        case "/requests":
            return <RequestsPage />;
        case "/missions":
            return <MissionsPage />;
        case "/stations":
            return <StationsPage />;
        case "/biomes":
            return <BiomesPage />;
        case "/employees":
            return <EmployeesPage />;
        case "/glossary":
            return <GlossaryPage />;
        case "/profile":
            return <ProfilePage />;
        case "/teams":
            return <TeamsPage />;
        case "/logistics":
        case "/logistics/shipments":
            return <LogisticsPage />;
        case "/logistics/cargo":
            return <CargoPage />;
        case "/store":
            return <StorePage />;
        case "/users":
            return <UsersPage />;
        default:
            // Redirect to dashboard for unknown routes
            if (isAuthenticated) {
                window.history.pushState({}, "", "/dashboard");
                return <DashboardPage />;
            }
            return <LoginPage />;
    }
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#161B22",
                        color: "#C9D1D9",
                        border: "1px solid #30363D",
                    },
                    className: "drg-toast",
                }}
            />
        </AuthProvider>
    );
}

function AppContent() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex items-center justify-center text-[#C9D1D9]">
                Загрузка...
            </div>
        );
    }

    return <Router />;
}
