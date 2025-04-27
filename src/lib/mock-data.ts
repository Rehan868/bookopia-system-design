// Mock data for the entire application
// This file serves as a central repository for all mock data used across the application

// Bookings
export const bookings = [
  {
    id: "b1",
    booking_number: "BK-2023-0001",
    guest_name: "John Smith",
    guest_email: "john.smith@example.com",
    guest_phone: "+1 (555) 123-4567",
    property: "Marina Tower",
    check_in: "2023-07-15",
    check_out: "2023-07-18",
    status: "confirmed",
    amount: 450,
    rooms: {
      number: "101",
      property: "Marina Tower"
    },
    notes: "Guest requested extra pillows"
  },
  {
    id: "b2",
    booking_number: "BK-2023-0002",
    guest_name: "Emma Johnson",
    guest_email: "emma.j@example.com",
    guest_phone: "+1 (555) 234-5678",
    property: "Downtown Heights",
    check_in: "2023-07-16",
    check_out: "2023-07-20",
    status: "checked-in",
    amount: 680,
    rooms: {
      number: "205",
      property: "Downtown Heights"
    },
    notes: "Late check-in expected around 10 PM"
  },
  {
    id: "b3",
    booking_number: "BK-2023-0003",
    guest_name: "Michael Chen",
    guest_email: "mchen@example.com",
    guest_phone: "+1 (555) 345-6789",
    property: "Marina Tower",
    check_in: "2023-07-12",
    check_out: "2023-07-14",
    status: "checked-out",
    amount: 320,
    rooms: {
      number: "303",
      property: "Marina Tower"
    },
    notes: ""
  },
  {
    id: "b4",
    booking_number: "BK-2023-0004",
    guest_name: "Sarah Davis",
    guest_email: "sdavis@example.com",
    guest_phone: "+1 (555) 456-7890",
    property: "Downtown Heights",
    check_in: "2023-07-18",
    check_out: "2023-07-25",
    status: "confirmed",
    amount: 1050,
    rooms: {
      number: "401",
      property: "Downtown Heights"
    },
    notes: "Anniversary celebration - please prepare complimentary champagne"
  },
  {
    id: "b5",
    booking_number: "BK-2023-0005",
    guest_name: "Robert Wilson",
    guest_email: "rwilson@example.com",
    guest_phone: "+1 (555) 567-8901",
    property: "Marina Tower",
    check_in: "2023-07-10",
    check_out: "2023-07-15",
    status: "cancelled",
    amount: 750,
    rooms: {
      number: "202",
      property: "Marina Tower"
    },
    notes: "Cancelled due to emergency"
  }
];

// Rooms
export const rooms = [
  {
    id: "r1",
    number: "101",
    property: "Marina Tower",
    type: "Deluxe Suite",
    capacity: 2,
    rate: 150,
    status: "occupied",
    maintenance: false,
    lastCleaned: "2023-07-15T08:30:00",
    nextCheckIn: "2023-07-18T14:00:00",
    floor: "1",
    description: "Luxurious suite with ocean view",
    amenities: ["WiFi", "Mini Bar", "Air Conditioning", "Ocean View"],
    features: { hasBalcony: true, hasBathtub: true },
    created_at: "2023-01-15T10:30:00",
    updated_at: "2023-07-15T08:30:00"
  },
  {
    id: "r2",
    number: "102",
    property: "Marina Tower",
    type: "Standard Room",
    capacity: 2,
    rate: 120,
    status: "available",
    maintenance: false,
    lastCleaned: "2023-07-15T09:45:00",
    nextCheckIn: null,
    floor: "1",
    description: "Comfortable standard room",
    amenities: ["WiFi", "Air Conditioning"],
    features: { hasBalcony: false, hasBathtub: false },
    created_at: "2023-01-15T10:35:00",
    updated_at: "2023-07-15T09:45:00"
  },
  {
    id: "r3",
    number: "201",
    property: "Downtown Heights",
    type: "Executive Suite",
    capacity: 3,
    rate: 220,
    status: "available",
    maintenance: true,
    lastCleaned: "2023-07-14T10:15:00",
    nextCheckIn: null,
    floor: "2",
    description: "Spacious executive suite with city view",
    amenities: ["WiFi", "Mini Bar", "Air Conditioning", "City View", "Work Desk"],
    features: { hasBalcony: true, hasBathtub: true },
    created_at: "2023-01-16T11:20:00",
    updated_at: "2023-07-14T10:15:00"
  },
  {
    id: "r4",
    number: "202",
    property: "Marina Tower",
    type: "Deluxe Suite",
    capacity: 2,
    rate: 150,
    status: "available",
    maintenance: false,
    lastCleaned: "2023-07-15T11:30:00",
    nextCheckIn: "2023-07-18T15:00:00",
    floor: "2",
    description: "Luxurious suite with garden view",
    amenities: ["WiFi", "Mini Bar", "Air Conditioning", "Garden View"],
    features: { hasBalcony: true, hasBathtub: false },
    created_at: "2023-01-16T11:45:00",
    updated_at: "2023-07-15T11:30:00"
  },
  {
    id: "r5",
    number: "303",
    property: "Marina Tower",
    type: "Standard Room",
    capacity: 2,
    rate: 120,
    status: "cleaning",
    maintenance: false,
    lastCleaned: "2023-07-14T08:00:00",
    nextCheckIn: "2023-07-16T14:00:00",
    floor: "3",
    description: "Comfortable standard room with partial ocean view",
    amenities: ["WiFi", "Air Conditioning", "Partial Ocean View"],
    features: { hasBalcony: false, hasBathtub: false },
    created_at: "2023-01-17T09:10:00",
    updated_at: "2023-07-14T08:00:00"
  }
];

// Expenses
export const expenses = [
  {
    id: "e1",
    description: "Cleaning Supplies",
    amount: 250.75,
    date: "2023-07-10",
    category: "Maintenance",
    property: "Marina Tower",
    vendor: "CleanCo Supplies",
    paymentMethod: "Credit Card",
    receipt: "receipt-e1.pdf",
    notes: "Monthly supply restock"
  },
  {
    id: "e2",
    description: "Plumbing Repair",
    amount: 475.00,
    date: "2023-07-08",
    category: "Maintenance",
    property: "Downtown Heights",
    vendor: "Ace Plumbing",
    paymentMethod: "Bank Transfer",
    receipt: "receipt-e2.pdf",
    notes: "Emergency repair in room 201"
  },
  {
    id: "e3",
    description: "Staff Salaries",
    amount: 3200.00,
    date: "2023-07-01",
    category: "Personnel",
    property: "All Properties",
    vendor: "Internal",
    paymentMethod: "Bank Transfer",
    receipt: null,
    notes: "Monthly salaries for July"
  },
  {
    id: "e4",
    description: "New Towels",
    amount: 350.25,
    date: "2023-07-05",
    category: "Supplies",
    property: "Marina Tower",
    vendor: "Hospitality Supplies Inc.",
    paymentMethod: "Credit Card",
    receipt: "receipt-e4.pdf",
    notes: "Replacement of worn towels"
  },
  {
    id: "e5",
    description: "Internet Service",
    amount: 180.00,
    date: "2023-07-03",
    category: "Utilities",
    property: "All Properties",
    vendor: "Comcast Business",
    paymentMethod: "Auto-Payment",
    receipt: "receipt-e5.pdf",
    notes: "Monthly internet service"
  }
];

// Users
export const users = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: null,
    lastActive: "2023-07-15T10:30:00",
    properties: ["Marina Tower", "Downtown Heights"]
  },
  {
    id: "u2",
    name: "Staff Member",
    email: "staff@example.com",
    role: "staff",
    avatar: null,
    lastActive: "2023-07-14T15:45:00",
    properties: ["Marina Tower"]
  },
  {
    id: "u3",
    name: "Property Manager",
    email: "manager@example.com",
    role: "manager",
    avatar: null,
    lastActive: "2023-07-15T09:15:00",
    properties: ["Downtown Heights"]
  }
];

// Owners
export const owners = [
  {
    id: "1",
    name: "John Miller",
    email: "john.miller@example.com",
    phone: "+1 (555) 123-9876",
    properties: 3,
    revenue: 75000,
    occupancy: 85,
    avatar: "/placeholder.svg",
    paymentDetails: {
      bank: "Bank of America",
      accountNumber: "****5678",
      routingNumber: "****9012"
    },
    joinedDate: "2022-01-15",
    rooms: ["r1", "r2", "r4"]
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 234-8765",
    properties: 2,
    revenue: 45000,
    occupancy: 75,
    avatar: null,
    paymentDetails: {
      bank: "Chase Bank",
      accountNumber: "****4567",
      routingNumber: "****8901"
    },
    joinedDate: "2022-03-10"
  },
  {
    id: "3",
    name: "Michael Thompson",
    email: "michael.t@example.com",
    phone: "+1 (555) 345-7654",
    properties: 4,
    revenue: 120000,
    occupancy: 92,
    avatar: "/placeholder.svg",
    paymentDetails: {
      bank: "Wells Fargo",
      accountNumber: "****3456",
      routingNumber: "****7890"
    },
    joinedDate: "2021-11-05"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    properties: 1,
    revenue: 35000,
    occupancy: 70,
    avatar: null,
    paymentDetails: {
      bank: "Citibank",
      accountNumber: "****2345",
      routingNumber: "****6789"
    },
    joinedDate: "2022-06-20"
  }
];

// Properties
export const properties = [
  {
    id: "p1",
    name: "Marina Tower",
    address: "123 Marina Blvd, Miami, FL 33101",
    totalRooms: 20,
    availableRooms: 8,
    occupancyRate: 60,
    owner: "o1"
  },
  {
    id: "p2",
    name: "Downtown Heights",
    address: "456 Main St, Miami, FL 33130",
    totalRooms: 15,
    availableRooms: 5,
    occupancyRate: 67,
    owner: "o2"
  }
];

// Cleaning status
export const cleaningStatus = [
  {
    id: "c1",
    roomId: "r1",
    status: "clean",
    lastCleaned: "2023-07-15T08:30:00",
    cleaner: "Jane Doe",
    notes: "All supplies restocked"
  },
  {
    id: "c2",
    roomId: "r2",
    status: "clean",
    lastCleaned: "2023-07-15T09:45:00",
    cleaner: "Jane Doe",
    notes: ""
  },
  {
    id: "c3",
    roomId: "r3",
    status: "needs-cleaning",
    lastCleaned: "2023-07-14T10:15:00",
    cleaner: "John Smith",
    notes: "Waiting for maintenance to finish"
  },
  {
    id: "c4",
    roomId: "r4",
    status: "clean",
    lastCleaned: "2023-07-15T11:30:00",
    cleaner: "John Smith",
    notes: ""
  },
  {
    id: "c5",
    roomId: "r5",
    status: "in-progress",
    lastCleaned: "2023-07-14T08:00:00",
    cleaner: "Jane Doe",
    notes: "Currently being cleaned"
  }
];

// Audit Logs
export const auditLogs = [
  {
    id: "a1",
    timestamp: "2023-07-15T10:15:30",
    user: "admin@example.com",
    action: "User Login",
    type: "authentication",
    details: "Successfully logged in from IP 192.168.1.100",
    ipAddress: "192.168.1.100"
  },
  {
    id: "a2",
    timestamp: "2023-07-15T10:30:45",
    user: "admin@example.com",
    action: "Create Booking",
    type: "booking",
    details: "Created booking BK-2023-0001 for John Smith",
    ipAddress: "192.168.1.100"
  },
  {
    id: "a3",
    timestamp: "2023-07-14T15:45:22",
    user: "staff@example.com",
    action: "Update Room",
    type: "room",
    details: "Updated status of Room 101 to 'Occupied'",
    ipAddress: "192.168.1.105"
  },
  {
    id: "a4",
    timestamp: "2023-07-14T16:20:10",
    user: "manager@example.com",
    action: "Delete Expense",
    type: "expense",
    details: "Deleted expense record for 'Office Supplies'",
    ipAddress: "192.168.1.110"
  },
  {
    id: "a5",
    timestamp: "2023-07-13T09:05:18",
    user: "system",
    action: "System Backup",
    type: "system",
    details: "Automated daily backup completed successfully",
    ipAddress: "localhost"
  }
];

// Dashboard statistics
export const dashboardStats = {
  availableRooms: 13,
  totalRooms: 35,
  todayCheckIns: 5,
  todayCheckOuts: 3,
  occupancyRate: 78,
  weeklyOccupancyTrend: "+5%",
  monthlyRevenue: 24500,
  pendingMaintenance: 2
};

// Add owner_rooms relationship data
export const ownerRooms = [
  {
    id: "or1",
    ownerId: "1",
    roomId: "r1",
    assignedDate: "2022-01-15"
  },
  {
    id: "or2",
    ownerId: "1",
    roomId: "r2",
    assignedDate: "2022-01-15"
  },
  {
    id: "or3",
    ownerId: "1",
    roomId: "r4",
    assignedDate: "2022-02-01"
  },
  {
    id: "or4",
    ownerId: "2",
    roomId: "r3",
    assignedDate: "2022-03-10"
  }
];
