
# Hotel Management System: Complete Design Documentation

This document provides detailed specifications for the Hotel Management System application, covering design elements, layouts, components, and functionality for each page. Use this as a reference guide for implementing or rebuilding the application.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Layout Structure](#layout-structure)
5. [Authentication Pages](#authentication-pages)
   - [Staff Login](#staff-login)
   - [Owner Login](#owner-login)
6. [Staff Portal](#staff-portal)
   - [Dashboard](#dashboard)
   - [Bookings](#bookings)
   - [Booking View](#booking-view)
   - [Booking Add/Edit](#booking-addedit)
   - [Rooms](#rooms)
   - [Room View](#room-view)
   - [Room Add/Edit](#room-addedit)
   - [Cleaning Status](#cleaning-status)
   - [Expenses](#expenses)
   - [Expense Add](#expense-add)
   - [Users](#users)
   - [Owners](#owners)
   - [Reports](#reports)
   - [Audit Logs](#audit-logs)
   - [Settings](#settings)
   - [Profile](#profile)
7. [Owner Portal](#owner-portal)
   - [Owner Dashboard](#owner-dashboard)
   - [Owner Bookings](#owner-bookings)
   - [Owner Availability](#owner-availability)
   - [Owner Cleaning Status](#owner-cleaning-status)
   - [Owner Reports](#owner-reports)
8. [Responsive Design](#responsive-design)
9. [Animation Specs](#animation-specs)
10. [State Management](#state-management)

---

## Color Palette

### Primary Colors
- **Primary Blue**: `#3B82F6` (tailwind blue-500) - Used for primary buttons, active states, and links
- **Primary Blue (Hover)**: `#2563EB` (tailwind blue-600) - Hover state for primary buttons
- **Primary Blue (Light)**: `#DBEAFE` (tailwind blue-100) - Background for highlighted items related to primary actions

### Secondary Colors
- **Secondary Gray**: `#F3F4F6` (tailwind gray-100) - Used for backgrounds, cards, and secondary elements
- **Secondary Gray (Dark)**: `#9CA3AF` (tailwind gray-400) - Used for borders and dividers

### Status Colors
- **Success Green**: `#10B981` (tailwind green-500) - For success states, confirmations, and available status
- **Success Green (Light)**: `#D1FAE5` (tailwind green-100) - Background for success states
- **Warning Amber**: `#F59E0B` (tailwind amber-500) - For warning states, pending actions
- **Warning Amber (Light)**: `#FEF3C7` (tailwind amber-100) - Background for warning states
- **Error Red**: `#EF4444` (tailwind red-500) - For error states, critical actions, cancellations
- **Error Red (Light)**: `#FEE2E2` (tailwind red-100) - Background for error states
- **Info Blue**: `#3B82F6` (tailwind blue-500) - For informational states
- **Info Blue (Light)**: `#DBEAFE` (tailwind blue-100) - Background for informational states

### Neutral Colors
- **White**: `#FFFFFF` - Background for cards, modals, and content areas
- **Off-White**: `#F9FAFB` (tailwind gray-50) - Page backgrounds
- **Light Gray**: `#E5E7EB` (tailwind gray-200) - Borders, dividers, and inactive states
- **Medium Gray**: `#6B7280` (tailwind gray-500) - Secondary text, icons
- **Dark Gray**: `#374151` (tailwind gray-700) - Primary text
- **Black**: `#111827` (tailwind gray-900) - Headings, important text

---

## Typography

### Font Families
- **Primary Font**: 'Inter', sans-serif - Used throughout the application for all text

### Font Sizes
- **Heading 1**: 30px (1.875rem) - Page titles
- **Heading 2**: 24px (1.5rem) - Section titles
- **Heading 3**: 20px (1.25rem) - Card titles, modal headers
- **Body Large**: 16px (1rem) - Primary text
- **Body Regular**: 14px (0.875rem) - Secondary text, form labels
- **Body Small**: 12px (0.75rem) - Captions, helper text
- **Micro**: 10px (0.625rem) - Badges, tags

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: 1.25 - For headings
- **Regular**: 1.5 - For body text
- **Loose**: 1.75 - For longer paragraphs

---

## Component Library

The application uses Shadcn UI components, a collection of accessible and customizable components built on Radix UI with Tailwind CSS. The components maintain a consistent look and feel across the application.

### Buttons
- **Primary**: Blue background, white text, rounded corners (0.5rem), padding of 0.5rem 1rem (py-2 px-4)
- **Secondary**: White background, gray border, gray text, rounded corners (0.5rem), padding of 0.5rem 1rem
- **Outline**: Transparent background, border matching text color, rounded corners (0.5rem)
- **Ghost**: Transparent background, no border, text color, hover adds light background
- **Destructive**: Red background, white text, rounded corners (0.5rem)
- **Button Sizes**: 
  - Small: py-1 px-3
  - Default: py-2 px-4
  - Large: py-2.5 px-5

### Cards
- White background (`#FFFFFF`)
- Light shadow: `shadow-sm`
- Border radius: `0.75rem` (rounded-xl)
- Border: `1px solid` border color from Light Gray (`#E5E7EB`)
- Padding: `1.5rem` (p-6)
- Card sections:
  - **Card Header**: pb-4
  - **Card Title**: text-lg font-semibold
  - **Card Description**: text-sm text-gray-500
  - **Card Content**: py-2
  - **Card Footer**: pt-4 flex justify-end gap-2

### Form Elements
- **Inputs**: 
  - Height: 2.5rem (h-10)
  - Border radius: 0.375rem (rounded-md)
  - Border: 1px solid Light Gray
  - Padding: px-3
  - Focus: Ring and border color using primary blue

- **Select Dropdowns**:
  - Same styling as inputs
  - Dropdown panel: White background, same border radius, shadow-md

- **Checkboxes & Radio Buttons**:
  - Size: 1rem × 1rem
  - Border radius for checkbox: 0.25rem (rounded)
  - Border radius for radio: 50% (rounded-full)
  - Checked state: Primary blue background, white check icon

- **Toggle/Switch**:
  - Height: 1.5rem
  - Width: 2.75rem
  - Border radius: 999px (rounded-full)
  - Background when off: Light Gray
  - Background when on: Primary Blue

### Tables
- Full width (w-full)
- Border-collapse
- Text alignment: left
- **Table Header**:
  - Font weight: Medium (font-medium)
  - Background: Very light gray (#F9FAFB)
  - Border bottom: 1px solid Light Gray
  - Padding: 0.75rem 1rem (py-3 px-4)
- **Table Row**:
  - Border bottom: 1px solid Light Gray
  - Hover state: Very light gray background
- **Table Cell**:
  - Padding: 0.75rem 1rem (py-3 px-4)

### Badges
- Small text: text-xs
- Font weight: Medium (font-medium)
- Padding: px-2.5 py-0.5
- Border radius: 9999px (rounded-full)
- Colors based on status:
  - Confirmed/Success: Green background, green text
  - Pending/Warning: Amber background, amber text
  - Cancelled/Error: Red background, red text
  - Info: Blue background, blue text
  - Default: Gray background, gray text

### Navigation
- **Sidebar**:
  - Width: 16rem (w-64)
  - Background: White
  - Border right: 1px solid Light Gray
  - Padding: 1.5rem (p-6)
  - **Nav Items**:
    - Padding: 0.5rem 0.75rem (py-2 px-3)
    - Border radius: 0.375rem (rounded-md)
    - Active state: Light blue background, primary blue text
    - Hover state: Very light gray background

- **Header**:
  - Height: 4rem (h-16)
  - Background: White
  - Border bottom: 1px solid Light Gray
  - Padding: 0 1.5rem (px-6)
  - Shadow: shadow-sm

### Modals/Dialogs
- Background overlay: Black with 25% opacity
- Modal:
  - White background
  - Border radius: 0.5rem (rounded-lg)
  - Shadow: shadow-lg
  - Max width: 32rem (max-w-2xl)
  - Padding: 1.5rem (p-6)

### Alerts
- Border radius: 0.375rem (rounded-md)
- Padding: 1rem (p-4)
- Border left: 4px solid (color varies by type)
- Colors based on type (same as badges)

### Tooltips
- Small text: text-xs
- Background: Dark gray (#374151)
- Text color: White
- Border radius: 0.25rem (rounded)
- Padding: 0.5rem 0.75rem (py-2 px-3)
- Max width: 15rem (max-w-xs)

---

## Layout Structure

### Main Layout

The application uses a consistent layout structure:

```
+-------------------------------------------------------+
|                       Header                          |
+----------+------------------------------------------+
|          |                                          |
|          |                                          |
| Sidebar  |              Content Area                |
|          |                                          |
|          |                                          |
+----------+------------------------------------------+
```

- **Header**: Fixed at the top, contains app logo, search, notifications, and user profile
- **Sidebar**: Fixed at the left, contains navigation items
- **Content Area**: Main content, scrollable, padded with p-6

### Responsive Behavior
- **Desktop**: Full sidebar visible (width: 16rem)
- **Tablet**: Collapsible sidebar, triggered by hamburger menu
- **Mobile**: Sidebar hidden by default, full-screen overlay when opened

### Page Structure
Each page follows a general structure:
```
+------------------------------------------+
| Page Title                               |
| Page Description                         |
+------------------------------------------+
| Filter/Action Bar                        |
+------------------------------------------+
|                                          |
|             Main Content                 |
|             (Tables, Cards, Forms)       |
|                                          |
+------------------------------------------+
| Footer Actions/Pagination (if applicable)|
+------------------------------------------+
```

---

## Authentication Pages

### Staff Login Page

**Layout**: Centered card on full-page background

**Components**:
- Logo section at top (h-16, mb-8)
- Login card:
  - Width: 24rem (max-w-md)
  - White background
  - Rounded corners (rounded-xl)
  - Shadow: shadow-lg
  - Padding: 2rem (p-8)
- Form elements:
  - Email input
  - Password input
  - "Forgot password" link (text-sm, text-primary, hover:underline)
  - Login button (full width, primary style)
- Switch to Owner Login link below card (mt-4, text-sm)

**States**:
- Loading state for login button
- Error state for invalid credentials
- Success state redirects to Dashboard

### Owner Login Page

**Layout**: Similar to Staff Login but with owner-specific branding

**Components**:
- Same structure as Staff Login
- "Owner Portal" text above login card
- Different background image/color to differentiate from staff login
- Switch to Staff Login link below card

**States**:
- Same states as Staff Login
- Success state redirects to Owner Dashboard

---

## Staff Portal

### Dashboard

**Layout**: Full-width with multi-column grid layout

**Components**:
1. **Page Header**:
   - Title: "Dashboard" (text-3xl font-bold)
   - Subtitle: "Welcome back to your hotel management dashboard" (text-muted-foreground)
   
2. **Stat Cards Row** (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4):
   - Available Rooms Card:
     - Icon: BedDouble
     - Value: "12" (text-2xl font-bold)
     - Label: "Available Rooms"
     - Trend indicator: "+2 from yesterday"
     - Description: "Out of 20 total rooms"
   - Today's Check-ins Card:
     - Icon: ArrowDownToLine
     - Value: "5" (text-2xl font-bold)
     - Label: "Today's Check-ins"
     - Description: "3 are arriving in the morning"
   - Today's Check-outs Card:
     - Icon: ArrowUpFromLine
     - Value: "3" (text-2xl font-bold)
     - Label: "Today's Check-outs"
     - Description: "All scheduled before noon"
   - Occupancy Rate Card:
     - Icon: Percent
     - Value: "78%" (text-2xl font-bold)
     - Label: "Occupancy Rate"
     - Trend indicator: "+5% from last week"

3. **Charts Section** (grid grid-cols-1 lg:grid-cols-3 gap-4):
   - Occupancy Chart (lg:col-span-2):
     - Line chart showing occupancy over time
     - X-axis: Last 14 days
     - Y-axis: Occupancy percentage
     - Card container with header
   - Today's Activity (lg:col-span-1):
     - Timeline of today's events
     - Check-ins, check-outs, maintenance
     - Each item has time, event type, and details

4. **Bookings & Activity Section** (grid grid-cols-1 lg:grid-cols-3 gap-4):
   - Today's Check-ins & Check-outs (grid grid-cols-1 md:grid-cols-2 gap-4, lg:col-span-2):
     - Two cards side by side
     - List of guests with name, room, and time
   - Recent Bookings (lg:col-span-2):
     - Table of recent bookings
     - Columns: Guest Name, Dates, Room, Status, Amount
     - Link to full bookings page
   - Action Items Card (lg:col-span-1):
     - List of tasks needing attention
     - Maintenance alerts with room links
     - Pending reviews count
     - Low inventory warnings
     - Quick action buttons at bottom

**States**:
- Loading state for data fetching
- Empty state if no data available

### Bookings

**Layout**: Full-width with filterable table/grid

**Components**:
1. **Page Header**:
   - Title: "Bookings" (text-3xl font-bold)
   - Subtitle: "Manage all your bookings in one place" (text-muted-foreground)
   - Add New Booking button (top right)

2. **Filter Card** (p-6 mb-8):
   - Search input with Search icon
   - Date range picker with calendar popup
   - Status dropdown (All, Confirmed, Checked In, Checked Out, Cancelled)
   - Property dropdown filter
   - Active filters indicator
   - Clear filters button
   
3. **View Toggle**:
   - Switch between List view and Grid view

4. **Bookings List/Grid**:
   - **List View**:
     - Table with columns: Guest, Property, Room, Check-in, Check-out, Amount, Status, Action
     - Status badges with appropriate colors
     - Action buttons for each booking
   - **Grid View**:
     - Cards with booking details
     - Property/room image
     - Guest info, dates, amount
     - Status badge
     - Action buttons

5. **Pagination**:
   - Page numbers
   - Previous/Next buttons
   - Items per page selector

**States**:
- Loading state for data fetching
- Empty state if no bookings match filters
- Success/error toast notifications for actions

### Booking View

**Layout**: Full-width with multi-column layout

**Components**:
1. **Page Header**:
   - Title: "Booking #[ID]" (text-3xl font-bold)
   - Status badge
   - Action buttons (Edit, Cancel, Delete)
   
2. **Main Content** (grid grid-cols-1 lg:grid-cols-3 gap-6):
   - **Booking Details Card** (lg:col-span-2):
     - Guest information section
     - Contact details
     - Reservation details (dates, room, rate)
     - Payment information
     - Special requests
     - Notes section
     
   - **Side Panel** (lg:col-span-1):
     - Room preview card with image
     - Check-in/out actions
     - Timeline of booking events
     - Related bookings by same guest

3. **Action Buttons**:
   - Check-in guest button
   - Cancel booking button
   - Print/download button
   - Send confirmation email button

**States**:
- Loading state for data fetching
- Error state if booking not found
- Success/error toast notifications for actions

### Booking Add/Edit

**Layout**: Full-width form layout

**Components**:
1. **Page Header**:
   - Title: "Add New Booking" or "Edit Booking #[ID]" (text-3xl font-bold)
   
2. **Form Layout** (grid grid-cols-1 lg:grid-cols-3 gap-6):
   - **Main Form** (lg:col-span-2):
     - Guest information fields
       - Name
       - Email
       - Phone
     - Booking details
       - Property/location
       - Room selection
       - Check-in date with calendar picker
       - Check-out date with calendar picker
       - Number of adults/children
     - Additional options
       - Special requests textarea
       - Add-ons checkboxes
   
   - **Sidebar** (lg:col-span-1):
     - Price calculation card
       - Base room rate
       - Number of nights
       - Additional fees
       - Taxes
       - Total amount
     - Status selection
     - Payment status selection
     - Send confirmation checkbox
     - Preview selected room card

3. **Form Controls**:
   - Cancel button (outline style)
   - Save button (primary style)

**States**:
- Loading state when fetching data (for edit mode)
- Validation errors on fields
- Success/error toast notifications for form submission

### Cleaning Status

**Layout**: Full-width with filterable table

**Components**:
1. **Page Header**:
   - Title: "Cleaning Status" (text-3xl font-bold)
   - Subtitle: "Manage room cleaning status across all properties"

2. **Status Summary Cards** (flex flex-wrap gap-4 mb-8):
   - Clean rooms count with green indicator
   - In Progress rooms count with yellow indicator
   - Needs Cleaning rooms count with red indicator

3. **Filter Card** (p-6 mb-8):
   - Search input for room number
   - Property filter dropdown
   - Status filter dropdown (All, Clean, Needs Cleaning, In Progress)
   - Active filters indicator and clear button

4. **Rooms Table**:
   - Columns: Room, Property, Status, Last Cleaned, Next Check-in, Actions
   - Status indicator with icon and badge
   - Action buttons:
     - Mark Clean (green)
     - Start Cleaning (yellow)
     - Mark Dirty (red)
   - Conditional rendering of buttons based on current status

**States**:
- Loading state for data fetching
- Empty state if no rooms match filters
- Success/error toast notifications for status changes

### Expenses

**Layout**: Full-width with filterable table

**Components**:
1. **Page Header**:
   - Title: "Expenses" (text-3xl font-bold)
   - Subtitle: "Manage all property expenses"
   - Add New Expense button (top right)

2. **Filter Card** (p-6 mb-8):
   - Search input for expenses
   - Category filter dropdown
   - Date filter dropdown (All Time, This Month, Last Month, This Year)
   - Results count and clear filters button

3. **Expenses Table**:
   - Columns: Description, Amount, Date, Category, Actions
   - Category displayed as badge
   - Amount formatted as currency
   - Actions: View and Edit buttons
   - Table caption showing total results

4. **Pagination**:
   - Page numbers
   - Previous/Next buttons

**States**:
- Loading state with animated spinner
- Empty state if no expenses match filters
- Error state with retry button

### Expense Add

**Layout**: Form layout with two columns

**Components**:
1. **Page Header**:
   - Title: "Add New Expense" (text-3xl font-bold)
   - Subtitle: "Track a new expense for your property"

2. **Form Layout** (grid grid-cols-1 lg:grid-cols-3 gap-6):
   - **Main Form** (lg:col-span-2):
     - Expense Details card:
       - Description input
       - Amount input with currency prefix
       - Date picker
       - Category dropdown
       - Property dropdown
       - Vendor/supplier input
       - Payment method dropdown
       - Notes textarea
   
   - **Sidebar** (lg:col-span-1):
     - Receipt Upload card:
       - Drag and drop zone
       - Upload button
       - File type restrictions
     - Expense Tips box:
       - List of helpful tips for expense management

3. **Form Controls** (flex justify-end gap-4):
   - Cancel button (outline style)
   - Add Expense button (primary style)

**States**:
- Form validation states
- Upload progress for receipt
- Success/error toast notifications for form submission

### Audit Logs

**Layout**: Full-width with filterable table

**Components**:
1. **Page Header**:
   - Title: "Audit Logs" (text-3xl font-bold)
   - Subtitle: "Track all activity across your system"
   - Action buttons:
     - Export Logs button
     - Security Report button

2. **Filter Card** (p-6 mb-8):
   - Search input for logs
   - Date range picker
   - Log type filter (All, Authentication, Booking, User, System, Settings)

3. **Logs Table**:
   - Columns: Type, Timestamp, User, Action, IP Address, Details
   - Type column with icon and badge
   - Monospace font for technical data (timestamp, IP)
   - System user specially marked

4. **Pagination** (mt-8 flex justify-between):
   - Results count text
   - Previous/Next buttons
   - Retention policy notice box

**States**:
- Loading state for data fetching
- Empty state if no logs match filters

---

## Owner Portal

### Owner Dashboard

**Layout**: Similar to staff dashboard but simplified

**Components**:
1. **Page Header**:
   - Title: "Owner Dashboard" (text-3xl font-bold)
   - Subtitle: "Manage your properties and monitor performance"

2. **Stat Cards Row** (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4):
   - Available Rooms Card
   - Today's Check-ins Card
   - Today's Check-outs Card
   - Occupancy Rate Card
   - Monthly Revenue Card
   - Quick Actions Card:
     - Grid of action buttons
     - View Bookings
     - Check Availability
     - Cleaning Status
     - Reports

3. **Charts Section** (grid grid-cols-1 lg:grid-cols-3 gap-4):
   - Occupancy Chart (lg:col-span-2)
   - Today's Activity (lg:col-span-1):
     - Today's Check-ins card
     - Today's Check-outs card

**States**:
- Loading state for data fetching
- Empty state if no data available

### Owner Bookings

**Layout**: Full-width with table

**Components**:
1. **Page Header**:
   - Title: "Bookings" (text-3xl font-bold)
   - Subtitle: "Manage reservations for your properties"

2. **Bookings Table**:
   - Bordered with shadow-sm
   - Columns: Guest, Property, Room, Check-in, Check-out, Amount, Status, Action
   - Status badges with appropriate colors
   - View button for each booking

**States**:
- Loading state for data fetching
- Empty state if no bookings

### Owner Availability

**Layout**: Two-column grid layout

**Components**:
1. **Page Header**:
   - Title: "Availability Calendar" (text-3xl font-bold)
   - Subtitle: "Check room availability for your properties"

2. **Content Layout** (grid grid-cols-1 md:grid-cols-3 gap-6):
   - **Calendar Card** (md:col-span-1):
     - Date picker calendar
     - Month navigation
     - Today button
   
   - **Room Status Card** (md:col-span-2):
     - Title showing selected date
     - Grid of room status cards:
       - Available rooms (green)
       - Booked rooms (red)
       - Maintenance rooms (yellow)
       - Room number and status label

**States**:
- Initial state with today's date selected
- Selected date state showing rooms for that date

---

## Responsive Design

### Breakpoints
- **Small (sm)**: 640px
- **Medium (md)**: 768px
- **Large (lg)**: 1024px
- **Extra Large (xl)**: 1280px
- **2XL (2xl)**: 1536px

### Design Adjustments by Breakpoint

**Mobile (< 640px)**:
- Single column layouts throughout
- Sidebar hidden by default, toggleable with hamburger menu
- Tables convert to card layouts
- Form fields at full width
- Action buttons stacked vertically

**Tablet (640px - 1023px)**:
- Two-column layouts where appropriate
- Sidebar toggleable but initially visible
- Tables remain as tables with horizontal scrolling if needed
- Form layouts more spacious

**Desktop (≥ 1024px)**:
- Multi-column layouts (2-4 columns)
- Sidebar permanently visible
- Tables full-width with all columns visible
- Side-by-side forms and panels

---

## Animation Specs

### Page Transitions
- **Page Entry**: Fade in with slight upward movement (0.4s)
- **Page Exit**: Fade out (0.3s)

### Component Animations
- **Card Entry**: Slide up with staggered delay (0.5s)
- **Stat Cards**: Sequential slide up animations with 100ms delay between each
- **Alert/Toast**: Slide in from right, auto-hide after 5 seconds
- **Modal**: Fade in with scale (0.2s)
- **Sidebar Toggle**: Slide in/out (0.3s)
- **Loading Spinner**: Continuous rotation animation
- **Hover Effects**: Subtle scale (1.02) and shadow increase on cards/buttons

### Animation Classes
- `animate-fade-in`: Opacity 0 to 1 over 0.6s
- `animate-slide-up`: Translate Y 20px to 0 with opacity change over 0.5s
- `animate-slide-in`: Translate X 20px to 0 with opacity change over 0.5s
- `[animation-delay:100ms]`: Delay animation by 100ms (can be adjusted)

---

## State Management

### Application State
- **Authentication State**: Managed via localStorage (demo) or session storage
  - `staffLoggedIn`: Boolean
  - `userId`: String
  - `userName`: String
  - `userRole`: String
  - For owners, similar properties prefixed with "owner"

### Data Fetching
- Uses `@tanstack/react-query` for data fetching and caching
- Custom hooks for each data type:
  - `useBookings()`: Fetches all bookings
  - `useBooking(id)`: Fetches a single booking
  - `useRooms()`: Fetches all rooms
  - `useRoom(id)`: Fetches a single room
  - And similar patterns for other data types

### Local Component State
- Form state managed with controlled components or react-hook-form
- UI state (modals, filters, pagination) managed with useState hooks
- Complex forms use formik or react-hook-form with schema validation

### Notifications
- Toast notifications for success/error messages
- Implementation via custom toast hook: `useToast()`

---

## Building New Dashboard Component

When rebuilding the Dashboard, follow these exact specifications:

### Layout
- Full width container with max-width-[1600px] and mx-auto
- Overall page has animate-fade-in class for entry animation
- Padding: p-6

### Page Header
```html
<div>
  <h1 className="text-3xl font-bold">Dashboard</h1>
  <p className="text-muted-foreground mt-1">Welcome back to your hotel management dashboard.</p>
</div>
```

### Stat Cards
- Grid layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Each StatCard has:
  - Icon component (from lucide-react)
  - title (string)
  - value (string)
  - className for animation sequencing
  - Optional trend (up/down) with trendValue
  - Optional description text

### Charts Section
- Grid layout: grid grid-cols-1 lg:grid-cols-3 gap-4
- OccupancyChart in lg:col-span-2
- TodayActivity in remaining column

### Bookings & Actions Section
- Grid layout: grid grid-cols-1 lg:grid-cols-3 gap-4
- Left/Center (lg:col-span-2):
  - Nested grid: grid grid-cols-1 md:grid-cols-2 gap-4 for TodayCheckins and TodayCheckouts
  - RecentBookings below these components
- Right (lg:col-span-1):
  - Quick action buttons laid out in 2-column grid
  - Each button has icon + text and is a Link component
  - Use asChild prop to pass button styling to Link

### Animations
- Main container: animate-fade-in
- First stat card: animate-slide-up
- Subsequent stat cards: animate-slide-up [animation-delay:100ms], [animation-delay:200ms], etc.
- All components should fade in smoothly when the page loads

### Action Buttons (replacing Action Items)
- Use outlined buttons with icons and text
- Layout in 2x2 or 3x2 grid
- Each button links to relevant section of application
- Equal width and height for consistency
- Icons on the left, text right-aligned
- Hover effect: slight color change and shadow

### Hover Effects
- All cards should have subtle hover effect
- Use transition-all duration-200
- On hover, slightly increase shadow and scale to 1.02

