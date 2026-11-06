import { Vehicle, ServicePackage, WorkOrder, InvoiceItem, InventoryItem, ApexAccount } from '../types';

export const HERO_IMAGE = '/src/assets/images/dyno_bay_hero_1790838006609.jpg';
export const ROTOR_IMAGE = '/src/assets/images/rotor_brake_cam_1790838019405.jpg';
export const BMW_IMAGE = '/src/assets/images/bmw_m4_bavarian_1790838032176.jpg';
export const AUDI_IMAGE = '/src/assets/images/audi_rs6_quattro_1790838043797.jpg';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-911',
    name: 'Porsche 911 GT3',
    edition: 'Stuttgart Track Spec',
    specs: 'Generation 992 • 4.0L Boxer NA',
    plate: 'APX-911-GT',
    vin: 'WP0AF2A97PS293411',
    body: 'Coupe / Sports Track',
    mileage: '14,820 mi',
    healthScore: 96,
    healthLabel: 'Excellent',
    status: 'IN BAY 04 • LIVE DIAG',
    statusColor: 'blue',
    image: HERO_IMAGE,
    activeBay: 'Bay 04',
    warrantyValid: true,
  },
  {
    id: 'veh-m4',
    name: 'BMW M4 Competition',
    edition: 'Bavarian Motorsport',
    specs: 'G82 Chassis • 3.0L S58 Twin-Turbo',
    plate: 'TX-440-M4',
    vin: 'WBA33AY07NF418820',
    body: 'Performance Coupe',
    mileage: '28,150 mi',
    healthScore: 98,
    healthLabel: 'Optimal',
    status: 'READY / HEALTHY',
    statusColor: 'green',
    image: BMW_IMAGE,
    warrantyValid: true,
  },
  {
    id: 'veh-rs6',
    name: 'Audi RS6 Avant',
    edition: 'Ingolstadt Quattro',
    specs: 'C8 Platform • 4.0L TFSI Twin-Turbo V8',
    plate: 'AUSTIN-RS6',
    vin: 'WAUZZZF27RA089144',
    body: 'Performance Wagon',
    mileage: '8,400 mi',
    healthScore: 100,
    healthLabel: 'Factory',
    status: 'BOOKING PENDING',
    statusColor: 'amber',
    image: AUDI_IMAGE,
    warrantyValid: true,
  },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-oil',
    title: 'Oil & Fluidics Precision Flush',
    price: 89,
    description: 'Engineered extraction and replenishment ensuring thermal stabilization under high torque.',
    features: [
      'Synthetic racing-grade synthetic lubricants',
      'Micro-particulate OEM filter replacement',
      'Dynamic fluid pressure & viscosity benchmark'
    ],
    duration: '1h 15m',
    icon: 'oil_barrel',
  },
  {
    id: 'pkg-brakes',
    title: 'High-Performance Brake Servicing',
    price: 189,
    description: 'Uncompromising stopping power calibrated to exact micron manufacturer tolerances.',
    features: [
      'Ceramic low-dust pad fitting & bedding',
      'Slotted/drilled rotor surface runout machining',
      'Electronic caliper bleed & ABS actuator synch'
    ],
    duration: '2h 30m',
    icon: 'disc_full',
  },
  {
    id: 'pkg-health',
    title: '120-Point Health Check',
    price: 129,
    description: 'Full-spectrum mechanical, electrical, and structural telematics audit with digital imagery.',
    features: [
      'Comprehensive deep OBD-II / ECU module scan',
      'Battery internal impedance & discharge test',
      'Suspension damping & chassis laser scan'
    ],
    duration: '2h 00m',
    icon: 'monitor_heart',
  },
  {
    id: 'pkg-climate',
    title: 'Climate Thermodynamic Refresh',
    price: 149,
    description: 'HVAC decontamination and refrigerant recharge for maximum thermal efficiency.',
    features: [
      'Eco-refrigerant recovery & precision vacuum recharge',
      'Ultrasonic evaporator core sanitize & purge',
      'Electrostatic activated carbon HEPA cabin filter swap'
    ],
    duration: '1h 30m',
    icon: 'ac_unit',
  },
  {
    id: 'pkg-wheel',
    title: 'Computerized 3D Wheel & Alignment',
    price: 119,
    description: 'Multiview quad-camera optical triangulation for razor-sharp steering feedback and extended tire lifespan.',
    features: [
      'Laser geometry calibration (Camber, Caster, & Toe angles)',
      'High-speed road-force dynamic balancing',
      'Steering angle sensor zero-point adaptation'
    ],
    duration: '1h 45m',
    icon: 'tune',
  },
  {
    id: 'pkg-full-calib',
    title: '120-Point Diagnostic & Sensor Calibration',
    price: 640,
    description: 'Includes CAN-bus full scan, telemetry zeroing, and dynamic dyno bench run with master certification.',
    features: [
      'Complete CAN-bus bus network audit',
      'Dynamic dyno bench run & power mapping',
      'Sensor calibration & track zeroing'
    ],
    duration: '5h 00m',
    icon: 'precision_manufacturing',
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'ro-98210',
    token: 'BK-20260928-A1B2',
    vehicleId: 'veh-911',
    vehicleName: '2023 Porsche 911 GT3 (992)',
    vehicleChassis: 'Chassis: WP0AF2A97PS293411 • 4.0L Boxer NA',
    serviceTitle: '120-Point Precision Diagnostic & Brake Calibration',
    date: 'Today, Sep 28, 2026',
    status: 'In Progress',
    leadTechnician: {
      name: 'Alex Vance',
      id: '#08',
      cert: 'Level 4 Master Tech',
    },
    assignedBay: 'Bay 04 - Dyno & Brake',
    currentStage: 3,
    totalStages: 4,
    stageName: 'High-Torque Caliper Alignment & Bleed',
    progressPercent: 68,
    estCompletion: 'Today, 16:30 (42m rem.)',
    steps: [
      {
        stepNumber: 1,
        title: 'Check-In & Diagnostics',
        status: 'completed',
        time: 'Completed - 08:30 AM',
        description: 'Vehicle check-in & initial OBD-II scan finished. Zero stored engine fault codes detected across CAN-bus network.',
      },
      {
        stepNumber: 2,
        title: 'Precision Calibration',
        status: 'active',
        time: 'Active Execution',
        description: 'Currently executing: Micro-machining front carbon-ceramic rotors & high-temp synthetic fluidics pressure flush.',
        progressPercent: 68,
        tolerances: '±0.002mm',
        estClearance: '16:30',
      },
      {
        stepNumber: 3,
        title: 'Road Dyno & Certification',
        status: 'queued',
        time: 'Scheduled ~16:45',
        description: 'Final multi-point safety validation, telemetry high-rpm pull test, and electronic friction coefficient signoff.',
      },
      {
        stepNumber: 4,
        title: 'Client Handover',
        status: 'queued',
        time: 'Estimated 17:30',
        description: 'Contactless smart key release scheduled at Bay Secure Locker #04 with biometric signature prompt.',
      },
    ],
    technicianLog: {
      id: '#04-89',
      techName: 'Alex Vance',
      timeAgo: 'Logged 18 mins ago',
      note: 'Front left rotor showed 0.08mm micro-variance. Lathing sweep configured to factory spec. Brake fluid boiled test scored 210°C—flush is running smoothly.',
      camImage: ROTOR_IMAGE,
      camLabel: 'ROTOR_CAM_04',
    }
  },
  {
    id: 'ro-98211',
    token: 'BK-20261014-B981',
    vehicleId: 'veh-m4',
    vehicleName: '2022 BMW M4 Competition',
    vehicleChassis: 'Chassis: WBA33AY07NF418820 • 3.0L S58 Twin-Turbo',
    serviceTitle: 'Oil & Fluidics Precision Flush',
    date: 'Oct 14, 2026',
    status: 'Pending',
    leadTechnician: {
      name: 'Stefan Ruiz',
      id: '#12',
      cert: 'Senior Fluidics Specialist',
    },
    assignedBay: 'Bay 02 - Fluidics Dock',
    currentStage: 1,
    totalStages: 3,
    stageName: 'Intake Inspection & Staging',
    progressPercent: 15,
    estCompletion: 'Oct 14, 11:15 AM',
    steps: [
      {
        stepNumber: 1,
        title: 'Intake & Warm-up Staging',
        status: 'active',
        time: 'Scheduled - 09:00 AM',
        description: 'Thermal cycle check and pre-drain oil sample capture for spectral telemetry analysis.',
      },
      {
        stepNumber: 2,
        title: 'Dry Sump Evacuation',
        status: 'queued',
        time: 'Scheduled ~09:45 AM',
        description: 'Full pressurized removal of degraded engine fluids and installation of magnetic drain plugs.',
      },
      {
        stepNumber: 3,
        title: 'Racing Fluid Replenish',
        status: 'queued',
        time: 'Scheduled ~10:30 AM',
        description: 'Refill with Motul 300V Competition synthetic oil and lab viscosity verification.',
      }
    ]
  },
  {
    id: 'ro-98205',
    token: 'BK-20260810-F334',
    vehicleId: 'veh-rs6',
    vehicleName: '2024 Audi RS6 Avant',
    vehicleChassis: 'Chassis: WAUZZZF27RA089144 • 4.0L TFSI Twin-Turbo V8',
    serviceTitle: 'Computerized 3D Wheel Alignment & Balancing',
    date: 'Aug 10, 2026',
    status: 'Completed',
    leadTechnician: {
      name: 'Marco Leone',
      id: '#04',
      cert: 'Chassis & Alignment Tech',
    },
    assignedBay: 'Bay 06 - Chassis Rig',
    currentStage: 4,
    totalStages: 4,
    stageName: 'Work Completed & Calibrated',
    progressPercent: 100,
    estCompletion: 'Completed',
    steps: [
      {
        stepNumber: 1,
        title: 'Laser Geometry Assessment',
        status: 'completed',
        time: '10:00 AM',
        description: 'Quad-camera laser triangulation detected -0.4° toe discrepancy on rear right corner.',
      },
      {
        stepNumber: 2,
        title: 'Dynamic Adjustment',
        status: 'completed',
        time: '11:15 AM',
        description: 'Hydraulic camber & toe adjustment to within ±0.02° of Audi Sport track tolerances.',
      },
      {
        stepNumber: 3,
        title: 'Road Force Balancing',
        status: 'completed',
        time: '12:00 PM',
        description: 'Zero harmonic vibration detected at simulated 160 km/h wheel speeds.',
      }
    ]
  },
  {
    id: 'ro-98199',
    token: 'BK-20260702-D119',
    vehicleId: 'veh-911',
    vehicleName: '2023 Porsche 911 GT3 (992)',
    vehicleChassis: 'Chassis: WP0AF2A97PS293411 • 4.0L Boxer NA',
    serviceTitle: 'High-Performance Brake Servicing & Fluids',
    date: 'Jul 02, 2026',
    status: 'Delivered',
    leadTechnician: {
      name: 'Kurt Becker',
      id: '#01',
      cert: 'Master Motorsport Engineer',
    },
    assignedBay: 'Bay 04 - Dyno & Brake',
    currentStage: 3,
    totalStages: 3,
    stageName: 'Vehicle Delivered to Owner',
    progressPercent: 100,
    estCompletion: 'Completed',
    steps: [
      {
        stepNumber: 1,
        title: 'Castrol SRF Flush',
        status: 'completed',
        time: '13:00',
        description: 'High boiling point racing fluid flush through all 4 multi-piston monobloc calipers.',
      },
      {
        stepNumber: 2,
        title: 'Pad Torque Calibration',
        status: 'completed',
        time: '14:30',
        description: 'Titanium shims and ceramic pad torque checks completed with digital torque wrench.',
      }
    ]
  }
];

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-1',
    number: 'INV-2026-0891',
    bookingRef: 'BK-20260928-A1B2',
    vehicleName: '2023 Porsche 911 GT3',
    serviceDescription: '120-Point Diagnostic & Brake Calibration\nBay 04 • Apex Precision Rig',
    dateIssued: 'Sep 28, 2026',
    paymentMethod: 'Apple Pay (•••• 9021)',
    amount: 640.00,
    status: 'Pending',
  },
  {
    id: 'inv-2',
    number: 'INV-2026-0742',
    bookingRef: 'BK-20260810-F334',
    vehicleName: '2024 Audi RS6 Avant',
    serviceDescription: 'Computerized 3D Wheel Alignment & Balancing\nLaser Alignment Stage II',
    dateIssued: 'Aug 10, 2026',
    paymentMethod: 'Visa (•••• 4412)',
    amount: 285.00,
    status: 'Paid',
  },
  {
    id: 'inv-3',
    number: 'INV-2026-0618',
    bookingRef: 'BK-20260702-D119',
    vehicleName: '2023 Porsche 911 GT3',
    serviceDescription: 'High-Performance Brake Servicing & Fluids\nCastrol SRF Flush + Pad Torque Check',
    dateIssued: 'Jul 02, 2026',
    paymentMethod: 'Mastercard (•••• 8192)',
    amount: 410.00,
    status: 'Paid',
  },
  {
    id: 'inv-4',
    number: 'INV-2026-0499',
    bookingRef: 'BK-20260515-A012',
    vehicleName: '2022 BMW M4 Competition',
    serviceDescription: 'Oil & Fluidics Precision Flush (Motul 300V)\nDry Sump Evacuation & Lab Telemetry',
    dateIssued: 'May 15, 2026',
    paymentMethod: 'Apple Pay (•••• 9021)',
    amount: 235.00,
    status: 'Paid',
  },
  {
    id: 'inv-5',
    number: 'INV-2026-0310',
    bookingRef: 'BK-20260320-K771',
    vehicleName: '2022 BMW M4 Competition',
    serviceDescription: 'Pre-Season Dyno Calibration & Spark Plugs\nTwin-Scroll Boost Map & NGK Racing Plugs',
    dateIssued: 'Mar 20, 2026',
    paymentMethod: 'Visa (•••• 4412)',
    amount: 277.00,
    status: 'Paid',
  }
];

export const INVENTORY_PARTS: InventoryItem[] = [
  {
    id: 'part-1',
    name: 'Castrol SRF Racing Brake Fluid (SKU: CSRF-500)',
    sku: 'CSRF-500',
    unitPrice: 78.00,
    stock: 14,
    location: 'Warehouse Bay-B',
    category: 'Fluids & Chemicals'
  },
  {
    id: 'part-2',
    name: 'PAGID RSC1 Carbon-Ceramic Front Brake Pads',
    sku: 'PAG-RSC1-992',
    unitPrice: 420.00,
    stock: 6,
    location: 'Warehouse Bay-A',
    category: 'Braking Systems'
  },
  {
    id: 'part-3',
    name: 'Motul 300V Competition 5W-40 Synthetic (2L)',
    sku: 'MOT-300V-540',
    unitPrice: 52.00,
    stock: 28,
    location: 'Warehouse Bay-B',
    category: 'Fluids & Chemicals'
  },
  {
    id: 'part-4',
    name: 'NGK Racing R2556B-8 Spark Plug Set (x6)',
    sku: 'NGK-R2556B-6',
    unitPrice: 165.00,
    stock: 10,
    location: 'Warehouse Bay-C',
    category: 'Ignition'
  },
  {
    id: 'part-5',
    name: 'Porsche OEM Titanium Wheel Lug Bolts (x20)',
    sku: 'POR-TI-LUG20',
    unitPrice: 380.00,
    stock: 4,
    location: 'Warehouse Bay-A',
    category: 'Hardware'
  }
];

export const HISTORIC_SERVICE_ARCHIVE = [
  {
    id: 'hist-1',
    date: '2023-10-24',
    vehicle: 'Porsche 911 GT3 (992)',
    sub: 'APX-911-GT',
    service: 'Track Inspection & Brake Flush',
    serviceSub: 'PCCB caliper calibration + Motul RBF 660',
    leadMechanic: 'Kurt Becker',
    mechanicInitials: 'KB',
    status: 'In Progress',
    statusColor: 'blue',
    amount: '$1,480.00',
  },
  {
    id: 'hist-2',
    date: '2023-09-12',
    vehicle: 'Audi RS6 Avant (C8)',
    sub: 'AUSTIN-RS6',
    service: '10,000-Mi Full Scheduled Care',
    serviceSub: 'Synthetic oil change, carbon cabin purification',
    leadMechanic: 'Marco Leone',
    mechanicInitials: 'ML',
    status: 'Delivered',
    statusColor: 'purple',
    amount: '$890.50',
  },
  {
    id: 'hist-3',
    date: '2023-08-04',
    vehicle: 'BMW M4 Competition',
    sub: 'TX-440-M4',
    service: 'Twin Turbo Differential Flush',
    serviceSub: 'M-LSD fluid swap + high-speed dynamic dyno',
    leadMechanic: 'Stefan Ruiz',
    mechanicInitials: 'SR',
    status: 'Completed',
    statusColor: 'green',
    amount: '$1,125.00',
  },
  {
    id: 'hist-4',
    date: '2023-05-18',
    vehicle: 'Porsche 911 GT3 (992)',
    sub: 'APX-911-GT',
    service: 'Corner Balance & Alignment',
    serviceSub: '4-Wheel laser calibration + COTA track geo',
    leadMechanic: 'Kurt Becker',
    mechanicInitials: 'KB',
    status: 'Completed',
    statusColor: 'green',
    amount: '$2,450.00',
  },
  {
    id: 'hist-5',
    date: '2023-02-10',
    vehicle: 'BMW M4 Competition',
    sub: 'TX-440-M4',
    service: 'Comprehensive 180-Point PPI',
    serviceSub: 'Engine compression test, paint gauge mapping',
    leadMechanic: 'Stefan Ruiz',
    mechanicInitials: 'SR',
    status: 'Delivered',
    statusColor: 'purple',
    amount: '$650.00',
  }
];

export const APEX_ACCOUNTS: ApexAccount[] = [
  // CUSTOMER ACCOUNTS (Prefix: CUST-)
  {
    id: 'CUST-101',
    role: 'customer',
    name: 'Marcus Sterling',
    email: 'm.sterling@apex.io',
    phone: '+1 (555) 234-8901',
    tier: 'Platinum VIP',
    pass: 'ApexTrack992!',
    defaultVehicleId: 'veh-911',
  },
  {
    id: 'CUST-102',
    role: 'customer',
    name: 'Elena Rostova',
    email: 'e.rostova@quattro.de',
    phone: '+1 (555) 871-3329',
    tier: 'Gold Member',
    pass: 'V8BiTurbo2026!',
    defaultVehicleId: 'veh-rs6',
  },
  {
    id: 'CUST-103',
    role: 'customer',
    name: 'David Chen',
    email: 'd.chen@bavarian.io',
    phone: '+1 (555) 412-9904',
    tier: 'Track Club',
    pass: 'BimmerM4Comp!',
    defaultVehicleId: 'veh-m4',
  },

  // MECHANIC ACCOUNTS (Prefix: TECH- / MECH-)
  {
    id: 'TECH-08',
    role: 'mechanic',
    name: 'Alex Vance',
    email: 'a.vance@apex.io',
    badgeId: '#TECH-08-ALX',
    station: 'Bay 04 — Dyno & Brake',
    title: 'Level 4 Master Motorsport & Dyno Specialist',
    pass: 'ApexTechBay04!',
  },
  {
    id: 'TECH-01',
    role: 'mechanic',
    name: 'Kurt Becker',
    email: 'k.becker.tech@apex.io',
    badgeId: '#TECH-01-KRT',
    station: 'Bay 02 — High-Torque Chassis Rig',
    title: 'Master Motorsport Engineer',
    pass: 'ChassisRig2026!',
  },
  {
    id: 'TECH-04',
    role: 'mechanic',
    name: 'Maya Lin',
    email: 'm.lin@apex.io',
    badgeId: '#TECH-04-MYA',
    station: 'Bay 01 — Optical Laser Alignment',
    title: 'Suspension & Chassis Geometry Specialist',
    pass: 'LaserAlign992!',
  },

  // ADMIN ACCOUNTS (Prefix: ADM- / EXEC-)
  {
    id: 'ADM-01',
    role: 'admin',
    name: 'Director Kurt Becker',
    email: 'director.becker@apex.io',
    title: 'Managing Director & Chief Engineer',
    pass: 'ApexMasterAdmin2026!',
    pin: '992-SEC',
  },
  {
    id: 'ADM-02',
    role: 'admin',
    name: 'Sarah Jenkins',
    email: 's.jenkins@apex.io',
    title: 'Workshop Billing & Settlement Director',
    pass: 'ApexBillingController!',
    pin: '884-LED',
  },
];
