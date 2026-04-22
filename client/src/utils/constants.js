export const ASSET_CATEGORIES = [
    { value: 'laptop', label: 'Laptop', icon: '💻' },
    { value: 'desktop', label: 'Desktop', icon: '🖥️' },
    { value: 'monitor', label: 'Monitor', icon: '🖥️' },
    { value: 'keyboard', label: 'Keyboard', icon: '⌨️' },
    { value: 'mouse', label: 'Mouse', icon: '🖱️' },
    { value: 'phone', label: 'Phone', icon: '📱' },
    { value: 'tablet', label: 'Tablet', icon: '📱' },
    { value: 'printer', label: 'Printer', icon: '🖨️' },
    { value: 'chair', label: 'Chair', icon: '🪑' },
    { value: 'desk', label: 'Desk', icon: '🪑' },
    { value: 'projector', label: 'Projector', icon: '📽️' },
    { value: 'vehicle', label: 'Vehicle', icon: '🚗' },
    { value: 'other', label: 'Other', icon: '📦' }
];

export const ASSET_STATUS = [
    { value: 'available', label: 'Available', color: 'success' },
    { value: 'assigned', label: 'Assigned', color: 'primary' },
    { value: 'maintenance', label: 'Maintenance', color: 'warning' },
    { value: 'retired', label: 'Retired', color: 'danger' }
];

export const DEPARTMENTS = [
    'Engineering', 'Marketing', 'Sales', 'HR', 
    'Finance', 'Operations', 'Design', 'IT Support', 'Management'
];

export const AVATAR_COLORS = [
    'avatar-primary', 'avatar-success', 'avatar-warning',
    'avatar-danger', 'avatar-info', 'avatar-accent'
];

export const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

export const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getCategoryIcon = (category) => {
    const found = ASSET_CATEGORIES.find(c => c.value === category);
    return found ? found.icon : '📦';
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Sample Data
export const SAMPLE_ASSETS = [
    { id: 'AST-001', name: 'MacBook Pro 16"', category: 'laptop', status: 'assigned', purchaseDate: '2024-01-15', cost: 245000, serialNumber: 'MBP-2024-001', assignedTo: 'EMP-001', condition: 'Excellent' },
    { id: 'AST-002', name: 'Dell XPS 15', category: 'laptop', status: 'available', purchaseDate: '2024-02-20', cost: 165000, serialNumber: 'DXP-2024-002', assignedTo: null, condition: 'Good' },
    { id: 'AST-003', name: 'HP LaserJet Pro', category: 'printer', status: 'available', purchaseDate: '2023-11-10', cost: 35000, serialNumber: 'HLP-2023-003', assignedTo: null, condition: 'Good' },
    { id: 'AST-004', name: 'Samsung Monitor 27"', category: 'monitor', status: 'assigned', purchaseDate: '2024-03-05', cost: 28000, serialNumber: 'SM27-2024-004', assignedTo: 'EMP-002', condition: 'Excellent' },
    { id: 'AST-005', name: 'iPhone 15 Pro', category: 'phone', status: 'assigned', purchaseDate: '2024-01-25', cost: 134900, serialNumber: 'IP15-2024-005', assignedTo: 'EMP-003', condition: 'Excellent' },
    { id: 'AST-006', name: 'Herman Miller Chair', category: 'chair', status: 'maintenance', purchaseDate: '2023-06-15', cost: 95000, serialNumber: 'HMC-2023-006', assignedTo: null, condition: 'Fair' },
    { id: 'AST-007', name: 'Lenovo ThinkPad X1', category: 'laptop', status: 'assigned', purchaseDate: '2024-04-01', cost: 185000, serialNumber: 'LTP-2024-007', assignedTo: 'EMP-004', condition: 'Excellent' },
    { id: 'AST-008', name: 'iPad Pro 12.9"', category: 'tablet', status: 'available', purchaseDate: '2024-02-14', cost: 112900, serialNumber: 'IPD-2024-008', assignedTo: null, condition: 'Excellent' },
    { id: 'AST-009', name: 'Epson Projector', category: 'projector', status: 'retired', purchaseDate: '2021-08-20', cost: 75000, serialNumber: 'EPJ-2021-009', assignedTo: null, condition: 'Poor' },
    { id: 'AST-010', name: 'Standing Desk Electric', category: 'desk', status: 'assigned', purchaseDate: '2024-03-20', cost: 45000, serialNumber: 'SDK-2024-010', assignedTo: 'EMP-005', condition: 'Excellent' },
];

export const SAMPLE_EMPLOYEES = [
    { id: 'EMP-001', name: 'Aarav Patel', email: 'aarav@company.com', department: 'Engineering', designation: 'Senior Developer', phone: '+91 98765 43210', joinDate: '2022-03-15', status: 'active', assetsCount: 3 },
    { id: 'EMP-002', name: 'Priya Singh', email: 'priya@company.com', department: 'Design', designation: 'UI/UX Lead', phone: '+91 98765 43211', joinDate: '2021-07-01', status: 'active', assetsCount: 2 },
    { id: 'EMP-003', name: 'Vikram Mehta', email: 'vikram@company.com', department: 'Management', designation: 'Project Manager', phone: '+91 98765 43212', joinDate: '2020-11-20', status: 'active', assetsCount: 4 },
    { id: 'EMP-004', name: 'Sneha Gupta', email: 'sneha@company.com', department: 'Marketing', designation: 'Marketing Head', phone: '+91 98765 43213', joinDate: '2023-01-10', status: 'active', assetsCount: 2 },
    { id: 'EMP-005', name: 'Rohan Kumar', email: 'rohan@company.com', department: 'Engineering', designation: 'Full Stack Dev', phone: '+91 98765 43214', joinDate: '2023-06-15', status: 'active', assetsCount: 3 },
    { id: 'EMP-006', name: 'Ananya Reddy', email: 'ananya@company.com', department: 'HR', designation: 'HR Manager', phone: '+91 98765 43215', joinDate: '2021-04-01', status: 'active', assetsCount: 1 },
    { id: 'EMP-007', name: 'Karan Joshi', email: 'karan@company.com', department: 'Sales', designation: 'Sales Lead', phone: '+91 98765 43216', joinDate: '2022-09-20', status: 'inactive', assetsCount: 0 },
    { id: 'EMP-008', name: 'Diya Sharma', email: 'diya@company.com', department: 'Finance', designation: 'Accountant', phone: '+91 98765 43217', joinDate: '2023-11-01', status: 'active', assetsCount: 1 },
];

export const SAMPLE_ASSIGNMENTS = [
    { id: 'ASN-001', assetId: 'AST-001', assetName: 'MacBook Pro 16"', employeeId: 'EMP-001', employeeName: 'Aarav Patel', assignDate: '2024-01-20', returnDate: null, status: 'active', notes: 'For development work' },
    { id: 'ASN-002', assetId: 'AST-004', assetName: 'Samsung Monitor 27"', employeeId: 'EMP-002', employeeName: 'Priya Singh', assignDate: '2024-03-10', returnDate: null, status: 'active', notes: 'Design workspace setup' },
    { id: 'ASN-003', assetId: 'AST-005', assetName: 'iPhone 15 Pro', employeeId: 'EMP-003', employeeName: 'Vikram Mehta', assignDate: '2024-01-30', returnDate: null, status: 'active', notes: 'Official use' },
    { id: 'ASN-004', assetId: 'AST-007', assetName: 'Lenovo ThinkPad X1', employeeId: 'EMP-004', employeeName: 'Sneha Gupta', assignDate: '2024-04-05', returnDate: null, status: 'active', notes: 'Marketing campaigns' },
    { id: 'ASN-005', assetId: 'AST-002', assetName: 'Dell XPS 15', employeeId: 'EMP-005', employeeName: 'Rohan Kumar', assignDate: '2024-02-25', returnDate: '2024-05-10', status: 'returned', notes: 'Temporary assignment' },
    { id: 'ASN-006', assetId: 'AST-010', assetName: 'Standing Desk Electric', employeeId: 'EMP-005', employeeName: 'Rohan Kumar', assignDate: '2024-03-25', returnDate: null, status: 'active', notes: 'Workspace upgrade' },
];