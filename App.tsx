import React, { useState } from 'react';
import { ViewMode, Vehicle, ServicePackage, WorkOrder, InvoiceItem, CustomerUser, UserRole, ApexAccount } from './types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_WORK_ORDERS, 
  SERVICE_PACKAGES,
  INITIAL_INVOICES
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LiveCamModal } from './components/LiveCamModal';
import { ConciergeDrawer } from './components/ConciergeDrawer';
import { RegisterModal } from './components/RegisterModal';
import { LoginModal } from './components/LoginModal';
import { UnifiedAuthModal } from './components/UnifiedAuthModal';
import { MechanicLoginModal } from './components/MechanicLoginModal';
import { AddVehicleModal } from './components/AddVehicleModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { VehiclesView } from './views/VehiclesView';
import { WorkOrdersView } from './views/WorkOrdersView';
import { BookingWizardView } from './views/BookingWizardView';
import { BookingConfirmationView } from './views/BookingConfirmationView';
import { InvoicesView } from './views/InvoicesView';
import { MechanicPortalView } from './views/MechanicPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { CustomerLoginView } from './views/CustomerLoginView';
import { CustomerPortalView } from './views/CustomerPortalView';
import { MechanicLoginView } from './views/MechanicLoginView';
import { AdminLoginView } from './views/AdminLoginView';
import { UnifiedLoginView } from './views/UnifiedLoginView';
import { AccessDeniedView } from './views/AccessDeniedView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [activeWorkOrder, setActiveWorkOrder] = useState<WorkOrder>(INITIAL_WORK_ORDERS[0]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);

  const [customerUser, setCustomerUser] = useState<CustomerUser>({
    id: 'cust-1',
    name: 'Marcus Sterling',
    email: 'm.sterling@apex.io',
    phone: '+1 (555) 234-8901',
    tier: 'Platinum VIP',
    defaultVehicleId: 'veh-911',
    registeredDate: 'March 2025',
  });

  const [adminUser, setAdminUser] = useState({
    id: 'adm-01',
    name: 'Director Kurt Becker',
    email: 'director.becker@apex.io',
    title: 'Managing Director & Chief Engineer',
  });

  const [mechanicUser, setMechanicUser] = useState({
    id: 'tech-08',
    name: 'Alex Vance',
    badgeId: '#TECH-08-ALX',
    station: 'Bay 04 — Dyno & Brake',
    title: 'Level 4 Master Motorsport & Dyno Specialist',
  });

  // Booking states
  const [preselectedPackage, setPreselectedPackage] = useState<ServicePackage | undefined>(undefined);
  const [preselectedVehicle, setPreselectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [bookingToken, setBookingToken] = useState('BK-20260928-A1B2');

  // Modals
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialId, setLoginModalInitialId] = useState<string | undefined>(undefined);
  const [isMechanicLoginOpen, setIsMechanicLoginOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  // Unified ID-Based Login Handler (Abstraction: ID determines role automatically)
  const handleUnifiedLogin = (account: ApexAccount, tokenOrVin?: string, newVehicle?: Vehicle) => {
    if (account.role === 'admin') {
      setAdminUser({
        id: account.id,
        name: account.name,
        email: account.email,
        title: account.title || 'Managing Director & Chief Engineer',
      });
      setCurrentRole('admin');
      setCurrentView('admin');
    } else if (account.role === 'mechanic') {
      setMechanicUser({
        id: account.id,
        name: account.name,
        badgeId: account.badgeId || `#${account.id}`,
        station: account.station || 'Bay 04 — Dyno & Brake',
        title: account.title || 'Level 4 Master Motorsport & Dyno Specialist',
      });
      setCurrentRole('mechanic');
      setCurrentView('mechanic');
    } else {
      const cust: CustomerUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone || '+1 (555) 234-8901',
        tier: account.tier || 'Platinum VIP',
        defaultVehicleId: account.defaultVehicleId || 'veh-911',
        registeredDate: 'October 2026',
      };
      setCustomerUser(cust);
      setCurrentRole('customer');
      if (newVehicle) {
        setVehicles((prev) => [newVehicle, ...prev]);
      }
      if (tokenOrVin) {
        const matched = workOrders.find(
          (o) =>
            o.token.toLowerCase() === tokenOrVin.toLowerCase() ||
            o.id.toLowerCase() === tokenOrVin.toLowerCase()
        );
        if (matched) {
          setActiveWorkOrder(matched);
        }
      }
      setCurrentView('customer-portal');
    }
  };

  // Customer Login Success handler
  const handleCustomerLoginSuccess = (user: CustomerUser, tokenOrVin?: string, newVehicle?: Vehicle) => {
    setCustomerUser(user);
    setCurrentRole('customer');
    if (newVehicle) {
      setVehicles((prev) => [newVehicle, ...prev]);
    }
    if (tokenOrVin) {
      const matched = workOrders.find(
        (o) =>
          o.token.toLowerCase() === tokenOrVin.toLowerCase() ||
          o.id.toLowerCase() === tokenOrVin.toLowerCase()
      );
      if (matched) {
        setActiveWorkOrder(matched);
      }
    }
    setCurrentView('customer-portal');
  };

  // Mechanic Login handler
  const handleMechanicLoginSuccess = (techData: any) => {
    setMechanicUser(techData);
    setCurrentRole('mechanic');
    setCurrentView('mechanic');
  };

  // Admin Login handler
  const handleAdminLoginSuccess = (admData: any) => {
    setAdminUser(admData);
    setCurrentRole('admin');
    setCurrentView('admin');
  };

  // Logout handler - returns to public home page
  const handleLogout = () => {
    setCurrentRole(null);
    setCurrentView('landing');
  };

  // Pre-Booking from Customer Portal
  const handlePreBookingComplete = (
    veh: Vehicle,
    pkg: ServicePackage,
    date: string,
    time: string,
    bay: string
  ) => {
    const token = `BK-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: WorkOrder = {
      id: `ro-${Date.now().toString().slice(-5)}`,
      token,
      vehicleId: veh.id,
      vehicleName: veh.name,
      vehicleChassis: veh.specs,
      serviceTitle: pkg.title,
      date: `${date} at ${time}`,
      status: 'Pending',
      leadTechnician: {
        name: bay.includes('Alex') || bay.includes('04') ? 'Alex Vance' : 'Kurt Becker',
        id: '#08',
        cert: 'Level 4 Master Tech',
      },
      assignedBay: bay,
      currentStage: 1,
      totalStages: 4,
      stageName: 'Pre-Booking Slot Held',
      progressPercent: 15,
      estCompletion: `${date} 17:00`,
      steps: [
        {
          stepNumber: 1,
          title: 'Check-In & OBD Telemetry Scan',
          status: 'queued',
          time: time,
          description: 'Intake audit and module health check.',
        },
        {
          stepNumber: 2,
          title: 'Service Execution',
          status: 'queued',
          time: 'Post-Intake',
          description: pkg.description,
        },
        {
          stepNumber: 3,
          title: 'Dyno Bench Load Test',
          status: 'queued',
          time: 'Calibration',
          description: 'Dynamic power sweep and sensor verification.',
        },
        {
          stepNumber: 4,
          title: 'Handover & Lockbox Release',
          status: 'queued',
          time: 'Release',
          description: 'Key release and cryptographic service voucher.',
        },
      ],
      basePrice: pkg.price,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    setActiveWorkOrder(newOrder);
  };

  // Add generated invoice from Admin
  const handleAddInvoice = (newInvoice: InvoiceItem, updatedOrder?: WorkOrder) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    if (updatedOrder) {
      handleUpdateWorkOrder(updatedOrder);
    }
  };

  // Update invoice payment status
  const handleUpdateInvoiceStatus = (invoiceId: string, status: 'Paid' | 'Pending') => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status } : inv))
    );
  };

  // Quick Select from Landing
  const handleSelectPackageForBooking = (pkg: ServicePackage) => {
    setPreselectedPackage(pkg);
    setCurrentView('book');
  };

  // Select Vehicle from Garage to Book
  const handleSelectVehicleForBooking = (veh: Vehicle) => {
    setPreselectedVehicle(veh);
    setCurrentView('book');
  };

  // Complete Booking flow
  const handleBookingCompleted = (veh: Vehicle, pkg: ServicePackage, token: string) => {
    setBookingToken(token);
    setPreselectedVehicle(veh);
    setPreselectedPackage(pkg);

    // Add new pending work order
    const newOrder: WorkOrder = {
      id: `ro-${Date.now().toString().slice(-5)}`,
      token,
      vehicleId: veh.id,
      vehicleName: veh.name,
      vehicleChassis: veh.specs,
      serviceTitle: pkg.title,
      date: 'Today, Sep 28, 2026',
      status: 'In Progress',
      leadTechnician: {
        name: 'Alex Vance',
        id: '#08',
        cert: 'Level 4 Master Tech',
      },
      assignedBay: 'Bay 04 - Dyno & Multi-Sensor Calibration',
      currentStage: 1,
      totalStages: 4,
      stageName: 'Intake & Diagnostics Staging',
      progressPercent: 25,
      estCompletion: 'Today, 16:30',
      steps: [
        {
          stepNumber: 1,
          title: 'Check-In & Initial Scan',
          status: 'active',
          time: '11:30 AM',
          description: 'OBD-II telemetry logging and multi-point visual inspection.',
        },
        {
          stepNumber: 2,
          title: 'Service Execution',
          status: 'queued',
          time: '12:45 PM',
          description: pkg.description,
        },
        {
          stepNumber: 3,
          title: 'Dyno Bench Validation',
          status: 'queued',
          time: '03:15 PM',
          description: 'Multi-axis load testing and digital runout verification.',
        },
        {
          stepNumber: 4,
          title: 'Handover & Release',
          status: 'queued',
          time: '04:30 PM',
          description: 'Smart key lockbox release and cryptographic report generation.',
        },
      ],
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    setActiveWorkOrder(newOrder);
    setCurrentView('confirmation');
  };

  // Add new vehicle to garage
  const handleAddVehicle = (newVeh: Vehicle) => {
    setVehicles((prev) => [newVeh, ...prev]);
  };

  // Update Work Order from Mechanic Portal
  const handleUpdateWorkOrder = (updated: WorkOrder) => {
    setActiveWorkOrder(updated);
    setWorkOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  // If in Public Landing Mode
  if (currentView === 'landing') {
    return (
      <>
        <LandingView
          onNavigate={setCurrentView}
          onSelectPackageForBooking={handleSelectPackageForBooking}
          onOpenLiveCam={() => setIsLiveCamOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenLogin={(id) => {
            setLoginModalInitialId(id);
            setIsLoginModalOpen(true);
          }}
        />
        <LiveCamModal
          isOpen={isLiveCamOpen}
          onClose={() => setIsLiveCamOpen(false)}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={(account, vehicle) => {
            if (account) {
              handleUnifiedLogin(account, undefined, vehicle);
            }
          }}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          initialIdentifier={loginModalInitialId}
          onSuccess={handleUnifiedLogin}
        />
        <MechanicLoginModal
          isOpen={isMechanicLoginOpen}
          onClose={() => setIsMechanicLoginOpen(false)}
          onLoginSuccess={handleMechanicLoginSuccess}
        />
      </>
    );
  }

  // If in Mechanic Workstation Ops Mode
  if (currentView === 'mechanic') {
    if (currentRole !== 'mechanic') {
      return (
        <AccessDeniedView
          currentRole={currentRole}
          attemptedView="mechanic"
          onNavigate={setCurrentView}
        />
      );
    }
    return (
      <>
        <MechanicPortalView
          onNavigate={setCurrentView}
          workOrders={workOrders}
          activeWorkOrder={activeWorkOrder}
          onSelectWorkOrder={(order) => setActiveWorkOrder(order)}
          onUpdateWorkOrder={handleUpdateWorkOrder}
          onOpenMechanicLogin={() => setCurrentView('mechanic-login')}
        />
        <LiveCamModal
          isOpen={isLiveCamOpen}
          onClose={() => setIsLiveCamOpen(false)}
        />
      </>
    );
  }

  // Customer Page Login & Registration (with Full Validation & Assigned ID)
  if (currentView === 'customer-login') {
    return (
      <CustomerLoginView
        onNavigate={setCurrentView}
        onLoginSuccess={handleCustomerLoginSuccess}
      />
    );
  }

  // Unified ID-Based Single Sign-On Gateway (Abstraction: Role resolved by ID automatically)
  if (
    currentView === 'login' ||
    currentView === 'mechanic-login' ||
    currentView === 'admin-login'
  ) {
    return (
      <UnifiedLoginView
        onNavigate={setCurrentView}
        onLoginSuccess={handleUnifiedLogin}
        initialIdentifier={
          currentView === 'mechanic-login'
            ? 'TECH-08'
            : currentView === 'admin-login'
            ? 'ADM-01'
            : 'CUST-101'
        }
      />
    );
  }

  // Guard: If current view is admin and user is not admin
  if (currentView === 'admin' && currentRole !== 'admin') {
    return (
      <AccessDeniedView
        currentRole={currentRole}
        attemptedView="admin"
        onNavigate={setCurrentView}
      />
    );
  }

  // Guard: If mechanic tries to access admin or customer pages
  if (
    currentRole === 'mechanic' &&
    ['admin', 'dashboard', 'vehicles', 'book', 'confirmation', 'bookings', 'invoices', 'customer-portal'].includes(
      currentView
    )
  ) {
    return (
      <AccessDeniedView
        currentRole={currentRole}
        attemptedView={currentView}
        onNavigate={setCurrentView}
      />
    );
  }

  // Guard: If customer tries to access admin or mechanic pages
  if (
    currentRole === 'customer' &&
    ['admin', 'mechanic'].includes(currentView)
  ) {
    return (
      <AccessDeniedView
        currentRole={currentRole}
        attemptedView={currentView}
        onNavigate={setCurrentView}
      />
    );
  }

  // Guard: If unauthenticated tries to access protected views
  if (
    !currentRole &&
    ['dashboard', 'vehicles', 'book', 'confirmation', 'bookings', 'invoices', 'customer-portal', 'mechanic', 'admin'].includes(
      currentView
    )
  ) {
    return (
      <AccessDeniedView
        currentRole={currentRole}
        attemptedView={currentView}
        onNavigate={setCurrentView}
      />
    );
  }

  // If in Dedicated Customer Vehicle Status & Pre-Booking Portal
  if (currentView === 'customer-portal') {
    if (currentRole !== 'customer') {
      return (
        <AccessDeniedView
          currentRole={currentRole}
          attemptedView="customer-portal"
          onNavigate={setCurrentView}
        />
      );
    }
    return (
      <>
        <CustomerPortalView
          onNavigate={setCurrentView}
          customerUser={customerUser}
          vehicles={vehicles}
          workOrders={workOrders}
          activeWorkOrder={activeWorkOrder}
          onOpenLiveCam={() => setIsLiveCamOpen(true)}
          onOpenConcierge={() => setIsConciergeOpen(true)}
          onSelectVehicleForBooking={handleSelectVehicleForBooking}
          onPreBookingComplete={handlePreBookingComplete}
          onLogoutCustomer={handleLogout}
        />
        <LiveCamModal
          isOpen={isLiveCamOpen}
          onClose={() => setIsLiveCamOpen(false)}
        />
        <ConciergeDrawer
          isOpen={isConciergeOpen}
          onClose={() => setIsConciergeOpen(false)}
        />
      </>
    );
  }

  // Customer / Admin Portal Shell Layout (Images 1, 3, 7, 13, 16)
  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Ambient Radial Backdrops */}
      <div className="fixed top-0 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[130px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed top-1/2 right-10 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentView={currentView}
        currentRole={currentRole}
        onNavigate={setCurrentView}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenLogin={(id) => {
            setLoginModalInitialId(id);
            setIsLoginModalOpen(true);
          }}
          onOpenMechanicLogin={() => {
            setLoginModalInitialId('TECH-08');
            setIsLoginModalOpen(true);
          }}
          onNavigate={setCurrentView}
          currentView={currentView}
          currentRole={currentRole}
          customerUser={customerUser}
          adminUser={adminUser}
          mechanicUser={mechanicUser}
          onLogout={handleLogout}
          breadcrumbs={
            currentView === 'confirmation'
              ? 'Apex Portal › Bookings › Confirmation'
              : currentView === 'bookings'
              ? 'Apex Portal › Telemetry Center › Work Orders'
              : currentView === 'vehicles'
              ? 'Apex Portal › Hangar & Fleet'
              : currentView === 'invoices'
              ? 'Apex Portal › Finance & Ledger'
              : currentView === 'book'
              ? 'Apex Portal › Schedule Service'
              : currentView === 'admin'
              ? 'Apex Admin Console › Workshop Billing & Settlement'
              : undefined
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentView}
              onOpenLiveCam={() => setIsLiveCamOpen(true)}
              onOpenConcierge={() => setIsConciergeOpen(true)}
              vehicles={vehicles}
              activeWorkOrder={activeWorkOrder}
            />
          )}

          {currentView === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              onNavigate={setCurrentView}
              onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
              onSelectVehicleForService={handleSelectVehicleForBooking}
            />
          )}

          {currentView === 'bookings' && (
            <WorkOrdersView
              workOrders={workOrders}
              onNavigate={setCurrentView}
              onOpenLiveCam={() => setIsLiveCamOpen(true)}
              onOpenConcierge={() => setIsConciergeOpen(true)}
              currentRole={currentRole}
            />
          )}

          {currentView === 'book' && (
            <BookingWizardView
              vehicles={vehicles}
              onNavigate={setCurrentView}
              onBookingCompleted={handleBookingCompleted}
              preselectedPackage={preselectedPackage}
              preselectedVehicle={preselectedVehicle}
            />
          )}

          {currentView === 'confirmation' && (
            <BookingConfirmationView
              onNavigate={setCurrentView}
              bookingToken={bookingToken}
              selectedVehicle={preselectedVehicle}
              selectedPackage={preselectedPackage}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesView onNavigate={setCurrentView} invoices={invoices} currentRole={currentRole} />
          )}

          {currentView === 'admin' && (
            <AdminPortalView
              onNavigate={setCurrentView}
              workOrders={workOrders}
              invoices={invoices}
              vehicles={vehicles}
              onUpdateWorkOrder={handleUpdateWorkOrder}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <LiveCamModal
        isOpen={isLiveCamOpen}
        onClose={() => setIsLiveCamOpen(false)}
      />

      <ConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(account, vehicle) => {
          if (account) {
            handleUnifiedLogin(account, undefined, vehicle);
          }
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialIdentifier={loginModalInitialId}
        onSuccess={handleUnifiedLogin}
      />

      <MechanicLoginModal
        isOpen={isMechanicLoginOpen}
        onClose={() => setIsMechanicLoginOpen(false)}
        onLoginSuccess={handleMechanicLoginSuccess}
      />

      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
}
