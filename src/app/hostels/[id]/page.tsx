"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Star, Check, Wifi, Utensils, Car, Shield, Bed, Users, Calendar, Phone, Mail, ChevronLeft, ChevronRight, X } from "lucide-react";
import { mockHostels } from "@/lib/mockHostels";

export default function HostelDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const hostel = mockHostels.find(h => h.id === params.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!hostel) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Hostel Not Found</h2>
          <p className="text-[#64748B] mb-6">The hostel you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/hostels")}>Back to Listings</Button>
        </Card>
      </div>
    );
  }

  const facilityIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "Meals": Utensils,
    "Parking": Car,
    "Security": Shield,
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={() => setIsGalleryOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
            <X className="h-8 w-8" />
          </button>
          <button onClick={prevImage} className="absolute left-4 text-white hover:text-gray-300 p-4 rounded-full bg-black/50">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img src={hostel.images[currentImageIndex]} alt={`${hostel.name} ${currentImageIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain" />
          <button onClick={nextImage} className="absolute right-4 text-white hover:text-gray-300 p-4 rounded-full bg-black/50">
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-8 text-white text-sm">
            {currentImageIndex + 1} / {hostel.images.length}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/hostels")} className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            Back to Listings
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push(`/compare?ids=${hostel.id}`)}>Add to Compare</Button>
            <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90" onClick={() => router.push(`/inquiry?hostelId=${hostel.id}`)}>Send Inquiry</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Photo Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 h-[400px]">
          <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}>
            <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
          </div>
          {hostel.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative group cursor-pointer" onClick={() => { setCurrentImageIndex(idx + 1); setIsGalleryOpen(true); }}>
              <img src={img} alt={`${hostel.name} ${idx + 2}`} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
              {idx === 3 && hostel.images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">+{hostel.images.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold text-[#0F172A]">{hostel.name}</h1>
                    {hostel.verified && (
                      <Badge className="bg-[#0F766E] text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[#64748B]">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hostel.area}, {hostel.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="font-medium text-[#0F172A]">{hostel.rating}</span>
                      <span>({hostel.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{hostel.type}</Badge>
            </div>

            {/* Pricing & Availability */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Pricing & Availability</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-[#64748B] mb-1">Starting From</div>
                  <div className="text-2xl font-semibold text-[#0F172A]">रू {hostel.priceRange.min.toLocaleString()}</div>
                  <div className="text-sm text-[#64748B]">per month</div>
                </div>
                <div>
                  <div className="text-sm text-[#64748B] mb-1">Room Types</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hostel.roomTypes.map((type) => (
                      <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#64748B] mb-1">Vacancy Status</div>
                  <div className="text-lg font-medium text-[#16A34A] flex items-center gap-2 mt-2">
                    <Bed className="h-5 w-5" />
                    {hostel.vacantBeds} beds available
                  </div>
                </div>
              </div>
            </Card>

            {/* Facilities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Facilities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {hostel.facilities.map((facility) => {
                  const Icon = facilityIcons[facility] || Check;
                  return (
                    <div key={facility} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0F766E]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#0F766E]" />
                      </div>
                      <span className="text-[#0F172A]">{facility}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Food Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Food Service</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Food Included</span>
                  <span className="font-medium text-[#0F172A]">{hostel.foodIncluded ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Food Quality Rating</span>
                  <div className="flex items-center gap-2">
                    <Progress value={hostel.foodScore * 20} className="w-24 h-2" />
                    <span className="font-medium text-[#0F172A]">{hostel.foodScore}/5</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rules */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Hostel Rules</h2>
              <ul className="space-y-2 text-[#64748B]">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <span>Entry time: 6:00 AM - 10:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <span>Guests allowed with prior notice</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <span>Smoking and alcohol strictly prohibited</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <span>Monthly fee due by 5th of every month</span>
                </li>
              </ul>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Resident Reviews</h2>
              <div className="space-y-6">
                {[
                  { name: "Anish Sharma", rating: 5, date: "2 weeks ago", review: "Excellent hostel with good food and friendly staff. The rooms are clean and well-maintained. Highly recommend for students." },
                  { name: "Priya Thapa", rating: 4, date: "1 month ago", review: "Great location and facilities. Wi-Fi is fast. Only issue is the hot water timing could be longer." },
                  { name: "Rohan KC", rating: 5, date: "2 months ago", review: "Best hostel in the area. The warden is very supportive and food quality is consistently good." },
                ].map((review, idx) => (
                  <div key={idx} className="border-b border-[#E2E8F0] last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 bg-[#0F766E] text-white">
                        {review.name.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[#0F172A]">{review.name}</span>
                          <span className="text-sm text-[#64748B]">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-[#64748B]">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">View All {hostel.totalReviews} Reviews</Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Contact Hostel</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-[#64748B]">
                  <Phone className="h-5 w-5" />
                  <span>+977-1-4445566</span>
                </div>
                <div className="flex items-center gap-3 text-[#64748B]">
                  <Mail className="h-5 w-5" />
                  <span>info@himalayan.com</span>
                </div>
              </div>
              <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 mb-3" onClick={() => router.push(`/inquiry?hostelId=${hostel.id}`)}>
                Send Inquiry
              </Button>
              <Button variant="outline" className="w-full">Schedule Visit</Button>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Users className="h-5 w-5" />
                    <span>Total Capacity</span>
                  </div>
                  <span className="font-medium text-[#0F172A]">60 beds</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Calendar className="h-5 w-5" />
                    <span>Established</span>
                  </div>
                  <span className="font-medium text-[#0F172A]">2018</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Shield className="h-5 w-5" />
                    <span>Safety Rating</span>
                  </div>
                  <span className="font-medium text-[#0F172A]">Excellent</span>
                </div>
              </div>
            </Card>

            {/* Similar Hostels */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Similar Hostels</h3>
              <div className="space-y-4">
                {mockHostels.filter(h => h.id !== hostel.id && h.type === hostel.type).slice(0, 3).map((similar) => (
                  <div key={similar.id} className="flex gap-3 cursor-pointer hover:bg-[#F8FAFC] p-2 rounded-lg -m-2 transition-colors" onClick={() => router.push(`/hostels/${similar.id}`)}>
                    <img src={similar.images[0]} alt={similar.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#0F172A] truncate">{similar.name}</div>
                      <div className="text-sm text-[#64748B]">{similar.area}</div>
                      <div className="text-sm font-medium text-[#0F766E] mt-1">रू {similar.priceRange.min.toLocaleString()}/mo</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
