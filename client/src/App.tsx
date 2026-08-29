import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Home from "./pages/Home";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const Conditions = lazy(() => import("./pages/Conditions"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"));
const AdminAccounting = lazy(() => import("./pages/AdminAccounting"));
const AdminDeliveries = lazy(() => import("./pages/AdminDeliveries"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Compte = lazy(() => import("./pages/Compte"));
const Product = lazy(() => import("./pages/Product"));
const AgentLogin = lazy(() => import("./pages/AgentLogin"));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <span>Chargement...</span>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/confidentialite"} component={Confidentialite} />
        <Route path={"/conditions"} component={Conditions} />
        <Route path={"/compte"} component={Compte} />
        <Route path={"/suivi/:orderNumber"} component={OrderTracking} />
        <Route path={"/produit/:id"} component={Product} />
        <Route path={"/admin/login"} component={AdminLogin} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/orders"} component={AdminOrders} />
        <Route path={"/admin/customers"} component={AdminCustomers} />
        <Route path={"/admin/accounting"} component={AdminAccounting} />
        <Route path={"/admin/deliveries"} component={AdminDeliveries} />
        <Route path={"/agent/login"} component={AgentLogin} />
        <Route path={"/agent"} component={AgentDashboard} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
