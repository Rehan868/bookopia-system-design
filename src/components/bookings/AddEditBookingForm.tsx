import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { format, isAfter, isBefore, isSameDay, addDays, startOfToday } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createBooking, updateBooking, fetchProperties, fetchRooms, fetchSingleRoomAvailability } from '@/services/api';

interface BookingFormData {
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  roomId: string;
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

interface Property {
  id: string;
  name: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  property_id?: string;
  property?: string;
  rate: number;
  capacity: number;
  status: string;
  bookedDates?: string[];
}

interface AddEditBookingFormProps {
  mode: 'add' | 'edit';
  bookingData?: Partial<BookingFormData>;
}

const ensureNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const formatNumber = (value: any): string => {
  const num = ensureNumber(value);
  return num.toFixed(2);
};

const calendarStyles = {
  unavailable: {
    opacity: 0.4,
    textDecoration: 'line-through',
    backgroundColor: 'rgb(254, 226, 226)',
    color: 'rgb(185, 28, 28)',
    cursor: 'not-allowed'
  }
};

export function AddEditBookingForm({ mode, bookingData }: AddEditBookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  const defaultData: BookingFormData = {
    reference: mode === 'edit' ? bookingData?.reference || '' : `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: bookingData?.guestName || '',
    guestEmail: bookingData?.guestEmail || '',
    guestPhone: bookingData?.guestPhone || '',
    property: bookingData?.property || '',
    roomId: bookingData?.roomId || '',
    roomNumber: bookingData?.roomNumber || '',
    checkIn: bookingData?.checkIn || new Date(),
    checkOut: bookingData?.checkOut || addDays(new Date(), 3),
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
    amountPaid: ensureNumber(bookingData?.amountPaid) || 0,
    pendingAmount: 0,
  };
  
  const [formData, setFormData] = useState<BookingFormData>(defaultData);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: formData.checkIn,
    to: formData.checkOut,
  });
  
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoadingProperties(true);
      try {
        const propertiesData = await fetchProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error loading properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load properties. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProperties(false);
      }
    };
    
    loadProperties();
  }, [toast]);
  
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const roomsData = await fetchRooms();
        setRooms(roomsData);
        
        if (formData.property) {
          const propertyRooms = roomsData.filter(room => 
            room.property_id === formData.property || room.property === formData.property
          );
          setFilteredRooms(propertyRooms);
        }
      } catch (error) {
        console.error('Error loading rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rooms. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingRooms(false);
      }
    };
    
    loadRooms();
  }, [formData.property, toast]);
  
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
  
  useEffect(() => {
    if (formData.property) {
      const propertyRooms = rooms.filter(room => 
        room.property_id === formData.property || room.property === formData.property
      );
      setFilteredRooms(propertyRooms);
    } else {
      setFilteredRooms([]);
    }
  }, [formData.property, rooms]);
  
  useEffect(() => {
    if (formData.roomId) {
      const selectedRoom = rooms.find(room => room.id === formData.roomId);
      if (selectedRoom?.rate) {
        setFormData(prev => ({
          ...prev,
          baseRate: selectedRoom.rate,
          roomNumber: selectedRoom.number
        }));
      }
      
      if (dateRange.from && dateRange.to) {
        checkRoomAvailability(formData.roomId, dateRange.from, dateRange.to);
      }
    }
  }, [formData.roomId, rooms, dateRange]);
  
  const checkRoomAvailability = async (roomId: string, startDate: Date, endDate: Date) => {
    if (!roomId) return;
    
    setIsCheckingAvailability(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const roomAvailability = await fetchSingleRoomAvailability(roomId, startDateStr, endDateStr);
      
      const blockedDates = (roomAvailability.bookedDates || []).map(date => new Date(date));
      setBookedDates(blockedDates);
    } catch (error) {
      console.error('Error checking room availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to check room availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePropertyChange = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      property: propertyId,
      roomId: '',
    }));
  };
  
  const handleRoomChange = (roomId: string) => {
    setFormData(prev => ({
      ...prev,
      roomId: roomId,
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
  
  const isDateInPast = (date: Date) => {
    const today = startOfToday();
    return isBefore(date, today);
  };
  
  const isDateUnavailable = (date: Date) => {
    // Don't allow selection of past dates
    if (isDateInPast(date)) {
      return true;
    }
    
    // Check if the date is already booked
    return bookedDates.some(bookedDate => 
      isSameDay(date, bookedDate)
    );
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) return;
    
    setDateRange(range);
    setFormData(prev => {
      const updatedData = {
        ...prev,
        checkIn: range.from || prev.checkIn,
        checkOut: range.to || prev.checkOut,
      };
      
      if (range.from && range.to) {
        const nights = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
        const baseRate = ensureNumber(prev.baseRate);
        const totalAmount = baseRate * nights;
        const vat = totalAmount * 0.05;
        const tourismFee = totalAmount * 0.03;
        const commission = totalAmount * 0.1;
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
    
    if (formData.roomId && range.from && range.to) {
      checkRoomAvailability(formData.roomId, range.from, range.to);
    }
  };
  
  const getNumberOfNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(Math.abs(formData.checkOut.getTime() - formData.checkIn.getTime()) / msPerDay);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (bookedDates.length > 0) {
        const hasConflict = bookedDates.some(date => 
          (isAfter(date, formData.checkIn) || isSameDay(date, formData.checkIn)) && 
          (isBefore(date, formData.checkOut) || isSameDay(date, formData.checkOut))
        );
        
        if (hasConflict) {
          toast({
            title: 'Date Conflict',
            description: 'The selected dates are not available for this room. Please choose different dates.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      const selectedRoom = rooms.find(room => room.id === formData.roomId);
      const selectedProperty = properties.find(property => property.id === formData.property);
      
      const bookingData = {
        booking_number: formData.reference,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        check_in: format(formData.checkIn, 'yyyy-MM-dd'),
        check_out: format(formData.checkOut, 'yyyy-MM-dd'),
        room_id: formData.roomId,
        room_number: selectedRoom?.number || formData.roomNumber,
        property: selectedProperty?.name || formData.property,
        adults: formData.adults,
        children: formData.children,
        amount: formData.totalAmount,
        base_rate: formData.baseRate,
        amount_paid: formData.amountPaid,
        commission: formData.commission,
        tourism_fee: formData.tourismFee,
        vat: formData.vat,
        net_to_owner: formData.netToOwner,
        security_deposit: formData.securityDeposit,
        remaining_amount: formData.pendingAmount,
        status: formData.status,
        payment_status: formData.paymentStatus,
        notes: formData.notes
      };

      if (mode === 'add') {
        await createBooking(bookingData);
        toast({
          title: "Booking Created",
          description: `The booking for ${formData.guestName} has been created successfully.`,
        });
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = window.location.pathname.split('/').pop();
        
        if (!bookingId) {
          throw new Error('Booking ID not found');
        }
        
        await updateBooking(bookingId, bookingData);
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
                  {isLoadingProperties ? (
                    <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading properties...</span>
                    </div>
                  ) : (
                    <Select 
                      value={formData.property} 
                      onValueChange={handlePropertyChange} 
                      required
                    >
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room*</Label>
                  {isLoadingRooms ? (
                    <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading rooms...</span>
                    </div>
                  ) : (
                    <Select 
                      value={formData.roomId} 
                      onValueChange={handleRoomChange} 
                      disabled={!formData.property || filteredRooms.length === 0}
                      required
                    >
                      <SelectTrigger id="roomId">
                        <SelectValue placeholder={!formData.property ? "Select property first" : "Select room"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.number} - {room.type} (${room.rate}/night)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                    {isCheckingAvailability ? (
                      <div className="flex items-center justify-center p-4 h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Checking availability...</span>
                      </div>
                    ) : (
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                        disabled={isDateUnavailable}
                        modifiers={{
                          unavailable: (date) => isDateUnavailable(date)
                        }}
                        modifiersStyles={{
                          unavailable: {
                            backgroundColor: 'rgb(254, 226, 226)',
                            color: 'rgb(185, 28, 28)',
                            textDecoration: 'line-through'
                          }
                        }}
                        className="p-3 pointer-events-auto"
                        fromDate={startOfToday()}
                      />
                    )}
                  </PopoverContent>
                </Popover>
                {bookedDates.length > 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    * Dates highlighted in red are already booked for this room.
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Click once to select check-in date, click again to select check-out date.
                </p>
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
