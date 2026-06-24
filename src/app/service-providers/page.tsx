"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Upload, Wrench, Zap, Droplet, Wifi, Paintbrush, Hammer, Shield } from "lucide-react";
import Link from "next/link";

const serviceCategories = [
  { value: "plumber", label: "Plumber", icon: Droplet },
  { value: "electrician", label: "Electrician", icon: Zap },
  { value: "doctor", label: "Doctor/Clinic", icon: Shield },
  { value: "internet", label: "Internet Technician", icon: Wifi },
  { value: "cleaner", label: "Cleaner", icon: Wrench },
  { value: "carpenter", label: "Carpenter", icon: Hammer },
  { value: "painter", label: "Painter", icon: Paintbrush },
  { value: "water", label: "Water Supplier", icon: Droplet },
  { value: "appliance", label: "Appliance Repair", icon: Wrench },
];

const nepalAreas = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan",
  "Biratnagar", "Butwal", "Dharan", "Hetauda", "Janakpur"
];

export default function ServiceProviderRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
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
              <h1 className="text-2xl font-bold mb-2">Registration Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Your service provider registration has been received. Our team will review your application and contact you within 2-3 business days.
              </p>
              <Alert className="mb-6">
                <AlertDescription>
                  Application ID: <strong className="font-mono">SP-2024-{Math.floor(Math.random() * 10000)}</strong>
                  <br />
                  Status: <Badge variant="outline" className="ml-2">Pending Review</Badge>
                </AlertDescription>
              </Alert>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/service-providers">View All Providers</Link>
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
            <Link href="/service-providers" className="text-brand-teal font-medium">Service Providers</Link>
            <Link href="/login" className="hover:text-brand-teal">Login</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Register as Service Provider</h1>
          <p className="text-gray-600">Join our network and connect with hostels across Nepal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Information</CardTitle>
            <CardDescription>
              Fill in your details to register. We'll verify your information before approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name / Business Name *</Label>
                  <Input id="fullName" required placeholder="Enter your name or business name" />
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

              <div>
                <Label htmlFor="category">Service Category *</Label>
                <Select required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select your primary service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 block">Service Areas * (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nepalAreas.map(area => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={selectedAreas.includes(area)}
                        onCheckedChange={() => toggleArea(area)}
                      />
                      <label
                        htmlFor={area}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedAreas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedAreas.map(area => (
                      <Badge key={area} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select required>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select required>
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="When are you available?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24x7">24/7 Emergency Available</SelectItem>
                    <SelectItem value="business">Business Hours (9 AM - 6 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible Schedule</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  required
                  placeholder="Describe your services, specializations, and what makes you reliable..."
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 50 characters</p>
              </div>

              <div>
                <Label htmlFor="address">Business Address / Location</Label>
                <Input id="address" placeholder="Street address or landmark (optional)" />
              </div>

              <div>
                <Label className="mb-2 block">Documents (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Upload certificates, licenses, or ID proof</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple />
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  By registering, you agree to our terms of service and privacy policy. Your profile will be visible to hostel administrators after approval.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">What happens next?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Our team will review your application within 2-3 business days</li>
            <li>• We may contact you for verification or additional information</li>
            <li>• Once approved, your profile will be visible to hostel administrators</li>
            <li>• You'll receive direct requests from hostels needing your services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
