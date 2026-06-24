"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, CheckCircle2, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockHostels } from "@/lib/mockData";
import Link from "next/link";

export default function InquiryPage() {
  const [selectedHostel, setSelectedHostel] = useState(mockHostels[0]);
  const [date, setDate] = useState<Date>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-brand-teal">HostelHub</Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Inquiry Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Your inquiry for <strong>{selectedHostel.name}</strong> has been sent to the hostel management.
                They will contact you within 24-48 hours.
              </p>
              <Alert className="mb-6">
                <AlertDescription>
                  Check your email and phone for updates. Reference ID: <strong className="font-mono">INQ-2024-{Math.floor(Math.random() * 10000)}</strong>
                </AlertDescription>
              </Alert>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/hostels">Browse More Hostels</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-brand-teal">HostelHub</Link>
          <nav className="hidden md:flex gap-8 text-sm">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <Link href="/hostels" className="hover:text-brand-teal">Hostels</Link>
            <Link href="/compare" className="hover:text-brand-teal">Compare</Link>
            <Link href="/service-providers" className="hover:text-brand-teal">Service Providers</Link>
            <Link href="/login" className="hover:text-brand-teal">Login</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Submit Hostel Inquiry</h1>
          <p className="text-gray-600">Fill in your details and the hostel will contact you shortly</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Selected Hostel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  <img src={selectedHostel.image} alt={selectedHostel.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-2">{selectedHostel.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedHostel.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedHostel.rating}</span>
                  <span className="text-gray-600">({selectedHostel.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Starting from</span>
                  <span className="text-lg font-bold text-brand-teal">NPR {selectedHostel.price.toLocaleString()}/mo</span>
                </div>
                {selectedHostel.verified && (
                  <Badge variant="outline" className="border-green-600 text-green-600">
                    Verified
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>We'll share these details with the hostel management</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" required placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" required placeholder="98XXXXXXXX" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required placeholder="your.email@example.com" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomType">Preferred Room Type *</Label>
                      <Select required>
                        <SelectTrigger id="roomType">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Room</SelectItem>
                          <SelectItem value="double">Double Sharing</SelectItem>
                          <SelectItem value="triple">Triple Sharing</SelectItem>
                          <SelectItem value="quad">4+ Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Expected Move-In Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentLocation">Current Location</Label>
                    <Input id="currentLocation" placeholder="e.g., Pokhara, Chitwan (optional)" />
                  </div>

                  <div>
                    <Label htmlFor="institution">College/Institution (optional)</Label>
                    <Input id="institution" placeholder="Your college or workplace" />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes or Questions</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any specific requirements, preferences, or questions you have..."
                      rows={4}
                    />
                  </div>

                  <Alert>
                    <AlertDescription className="text-sm">
                      By submitting this inquiry, you consent to share your contact details with the hostel management.
                      They may contact you via phone, email, or SMS.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/hostels">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
