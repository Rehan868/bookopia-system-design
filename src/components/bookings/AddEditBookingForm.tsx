import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createBooking } from '@/services/api';

interface BookingFormData {
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  baseRate: number;
  totalAmount: number;
  securityDeposit: number;
  commission: number;
  tourismFee: number;
  vat: number;
  netToOwner: number;
  notes: string;
  status: string;
  paymentStatus: string;
  sendConfirmation: boolean;
  guestDocument?: File | null;
  amountPaid: number;
  pendingAmount: number;
}

interface AddEditBookingFormProps {
  mode: 'add' | 'edit';
  bookingData?: Partial<BookingFormData>;
}

// Helper function to ensure values are numbers
const ensureNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Format a number for display, handling potential non-numeric values
const formatNumber = (value: any): string => {
  const num = ensureNumber(value);
  return num.toFixed(2);
};

export function AddEditBookingForm({ mode, bookingData }: AddEditBookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const defaultData: BookingFormData = {
    reference: mode === 'edit' ? bookingData?.reference || '' : `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: bookingData?.guestName || '',
    guestEmail: bookingData?.guestEmail || '',
    guestPhone: bookingData?.guestPhone || '',
    property: bookingData?.property || '',
    roomNumber: bookingData?.roomNumber || '',
    checkIn: bookingData?.checkIn || new Date(),
    checkOut: bookingData?.checkOut || new Date(new Date().setDate(new Date().getDate() + 3)),
    adults: ensureNumber(bookingData?.adults) || 2,
    children: ensureNumber(bookingData?.children) || 0,
    baseRate: ensureNumber(bookingData?.baseRate) || 0,
    totalAmount: ensureNumber(bookingData?.totalAmount) || 0,
    securityDeposit: ensureNumber(bookingData?.securityDeposit) || 0,
    commission: ensureNumber(bookingData?.commission) || 0,
    tourismFee: ensureNumber(bookingData?.tourismFee) || 0,
    vat: ensureNumber(bookingData?.vat) || 0,
    netToOwner: ensureNumber(bookingData?.netToOwner) || 0,
    notes: bookingData?.notes || '',
    status: bookingData?.status || 'confirmed',
    paymentStatus: bookingData?.paymentStatus || 'pending',
    sendConfirmation: bookingData?.sendConfirmation !== undefined ? bookingData.sendConfirmation : true,
    guestDocument: null,
    amountPaid: bookingData?.amountPaid || 0,
    pendingAmount: 0, // This will be calculated
  };
  
  const [formData, setFormData] = useState<BookingFormData>(defaultData);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: formData.checkIn,
    to: formData.checkOut,
  });
  
  // Ensure numeric fields are always numbers when form data changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      adults: ensureNumber(prev.adults),
      children: ensureNumber(prev.children),
      baseRate: ensureNumber(prev.baseRate),
      totalAmount: ensureNumber(prev.totalAmount),
      securityDeposit: ensureNumber(prev.securityDeposit),
      commission: ensureNumber(prev.commission),
      tourismFee: ensureNumber(prev.tourismFee),
      vat: ensureNumber(prev.vat),
      netToOwner: ensureNumber(prev.netToOwner)
    }));
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ensureNumber(value),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        guestDocument: e.target.files![0]
      }));
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      sendConfirmation: checked,
    });
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
      setFormData(prev => {
        const updatedData = {
          ...prev,
          checkIn: range.from!,
          checkOut: range.to || range.from,
        };
        
        if (range.to) {
          const nights = Math.round((range.to.getTime() - range.from!.getTime()) / (1000 * 60 * 60 * 24));
          const baseRate = ensureNumber(prev.baseRate);
          const totalAmount = baseRate * nights;
          const vat = totalAmount * 0.05; // 5% VAT
          const tourismFee = totalAmount * 0.03; // 3% Tourism Fee
          const commission = totalAmount * 0.1; // 10% Commission
          const netToOwner = totalAmount - vat - tourismFee - commission;
          
          return {
            ...updatedData,
            totalAmount,
            vat,
            tourismFee,
            commission,
            netToOwner,
          };
        }
        
        return updatedData;
      });
    }
  };
  
  const getNumberOfNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(Math.abs(formData.checkOut.getTime() - formData.checkIn.getTime()) / msPerDay);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting booking data:', formData);
    
    try {
      if (mode === 'add') {
        // Create a new booking
        await createBooking({
          // Map form data to match the expected API format
          booking_number: formData.reference,
          guest_name: formData.guestName,
          guest_email: formData.guestEmail,
          guest_phone: formData.guestPhone,
          property: formData.property,
          room_number: formData.roomNumber,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          status: formData.status,
          total_amount: formData.totalAmount,
          amount: formData.totalAmount,
          amount_paid: formData.amountPaid,
          payment_status: formData.paymentStatus,
          special_requests: formData.notes,
          adults: formData.adults,
          children: formData.children,
          baseRate: formData.baseRate,
          commission: formData.commission,
          tourismFee: formData.tourismFee,
          vat: formData.vat,
          netToOwner: formData.netToOwner,
          securityDeposit: formData.securityDeposit,
          remaining_amount: formData.pendingAmount,
          // Need to handle file upload separately if needed
          guestDocument: formData.guestDocument ? 'pending-upload' : ''
        });
        
        toast({
          title: "Booking Created",
          description: `The booking for ${formData.guestName} has been created successfully.`,
        });
      } else {
        // Edit existing booking logic would go here
        toast({
          title: "Booking Updated",
          description: `The booking for ${formData.guestName} has been updated successfully.`,
        });
      }
      
      navigate('/bookings');
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Error",
        description: `There was an error saving the booking. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    const total = formData.totalAmount + formData.securityDeposit;
    const pending = total - formData.amountPaid;
    setFormData(prev => ({
      ...prev,
      pendingAmount: pending
    }));
  }, [formData.totalAmount, formData.securityDeposit, formData.amountPaid]);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{mode === 'add' ? 'Add New Booking' : 'Edit Booking'}</h1>
        <p className="text-muted-foreground mt-1">
          {mode === 'add' ? 'Create a new booking' : `Edit booking ${formData.reference}`}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
              <CardDescription>Enter the guest's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Booking Reference</Label>
                  <Input
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Booking Status</Label>
                  <Select name="status" value={formData.status} onValueChange={value => setFormData({...formData, status: value})}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guestName">Guest Name*</Label>
                <Input
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  placeholder="Enter guest's full name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email Address</Label>
                  <Input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleInputChange}
                    placeholder="guest@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestPhone">Phone Number</Label>
                  <Input
                    id="guestPhone"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guestDocument">Guest ID/Passport</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="guestDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {formData.guestDocument && (
                    <p className="text-sm text-muted-foreground">
                      {formData.guestDocument.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Overview of the current booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="font-medium text-blue-800">Stay Information</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Check-in</div>
                    <div className="text-right font-medium">
                      {formData.checkIn ? format(formData.checkIn, 'MMM dd, yyyy') : 'Not set'}
                    </div>
                    <div>Check-out</div>
                    <div className="text-right font-medium">
                      {formData.checkOut ? format(formData.checkOut, 'MMM dd, yyyy') : 'Not set'}
                    </div>
                    <div>Nights</div>
                    <div className="text-right font-medium">{getNumberOfNights()}</div>
                    <div>Guests</div>
                    <div className="text-right font-medium">
                      {formData.adults + formData.children} ({formData.adults} adults, {formData.children} children)
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Base Rate:</span>
                    <span>${formatNumber(formData.baseRate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nights:</span>
                    <span>× {getNumberOfNights()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>${formatNumber(formData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Security Deposit:</span>
                    <span>${formatNumber(formData.securityDeposit)}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grand Total:</span>
                    <span>${formatNumber(formData.totalAmount + formData.securityDeposit)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Payment Status:</span>
                    <Select name="paymentStatus" value={formData.paymentStatus} onValueChange={value => setFormData({...formData, paymentStatus: value})}>
                      <SelectTrigger className="h-7 w-24">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="sendConfirmation"
                  checked={formData.sendConfirmation}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="sendConfirmation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Send confirmation email to guest
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Enter the booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Property*</Label>
                  <Select name="property" value={formData.property} onValueChange={value => setFormData({...formData, property: value})} required>
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marina Tower">Marina Tower</SelectItem>
                      <SelectItem value="Downtown Heights">Downtown Heights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number*</Label>
                  <Select name="roomNumber" value={formData.roomNumber} onValueChange={value => setFormData({...formData, roomNumber: value})} required>
                    <SelectTrigger id="roomNumber">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="201">201</SelectItem>
                      <SelectItem value="202">202</SelectItem>
                      <SelectItem value="301">301</SelectItem>
                      <SelectItem value="302">302</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Booking Dates*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select booking dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">Adults*</Label>
                  <Input
                    id="adults"
                    name="adults"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.adults}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">Children</Label>
                  <Input
                    id="children"
                    name="children"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
              <CardDescription>Payment information and calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseRate">Base Rate (per night)*</Label>
                <Input
                  id="baseRate"
                  name="baseRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.baseRate}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission">Commission*</Label>
                <Input
                  id="commission"
                  name="commission"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.commission}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tourismFee">Tourism Fee*</Label>
                <Input
                  id="tourismFee"
                  name="tourismFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tourismFee}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat">VAT*</Label>
                <Input
                  id="vat"
                  name="vat"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.vat}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="netToOwner">Net To Owner*</Label>
                <Input
                  id="netToOwner"
                  name="netToOwner"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.netToOwner}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.securityDeposit}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid by Guest</Label>
                <Input
                  id="amountPaid"
                  name="amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-semibold">${formatNumber(formData.totalAmount + formData.securityDeposit)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                    <p className="text-lg font-semibold text-red-600">${formatNumber(formData.pendingAmount)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Add any additional notes or special requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any special requests or notes about this booking"
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/bookings')}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Create Booking' : 'Update Booking'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
