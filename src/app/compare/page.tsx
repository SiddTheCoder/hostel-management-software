"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Check, X, Plus, Wifi, Utensils, Car, Shield } from "lucide-react";
import { mockHostels } from "@/lib/mockHostels";

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      setSelectedIds(ids.split(",").slice(0, 3));
    }
  }, [searchParams]);

  const selectedHostels = selectedIds.map(id => mockHostels.find(h => h.id === id)).filter(Boolean);
  const availableHostels = mockHostels.filter(h => !selectedIds.includes(h.id));

  const addHostel = (id: string) => {
    if (selectedIds.length < 3) {
      const newIds = [...selectedIds, id];
      setSelectedIds(newIds);
      router.push(`/compare?ids=${newIds.join(",")}`);
    }
  };

  const removeHostel = (id: string) => {
    const newIds = selectedIds.filter(i => i !== id);
    setSelectedIds(newIds);
    if (newIds.length > 0) {
      router.push(`/compare?ids=${newIds.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  const facilityIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "Meals": Utensils,
    "Parking": Car,
    "Security": Shield,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F172A]">Compare Hostels</h1>
              <p className="text-sm text-[#64748B] mt-1">Compare up to 3 hostels side by side</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/hostels")}>Back to Listings</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedHostels.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-[#0F766E]/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-[#0F766E]" />
              </div>
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">No Hostels Selected</h2>
              <p className="text-[#64748B] mb-6">Start comparing by selecting hostels from the list below</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {mockHostels.slice(0, 3).map((hostel) => (
                <Card key={hostel.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => addHostel(hostel.id)}>
                  <img src={hostel.images[0]} alt={hostel.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                  <h3 className="font-semibold text-[#0F172A] mb-1">{hostel.name}</h3>
                  <div className="text-sm text-[#64748B] flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {hostel.area}
                  </div>
                  <Button size="sm" className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90">Add to Compare</Button>
                </Card>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Hostel Cards Row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(selectedHostels.length, 2)}, minmax(0, 1fr))` }}>
              {selectedHostels.map((hostel: any) => (
                <Card key={hostel.id} className="p-4 relative">
                  <button onClick={() => removeHostel(hostel.id)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors z-10">
                    <X className="h-4 w-4 text-[#64748B] hover:text-red-600" />
                  </button>
                  <img src={hostel.images[0]} alt={hostel.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-[#0F172A] flex-1">{hostel.name}</h3>
                    {hostel.verified && (
                      <Badge className="bg-[#0F766E] text-white text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#64748B] mb-4">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-medium text-[#0F172A]">{hostel.rating}</span>
                    <span>({hostel.totalReviews})</span>
                  </div>
                  <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90" onClick={() => router.push(`/hostels/${hostel.id}`)}>View Details</Button>
                </Card>
              ))}
              {selectedHostels.length < 3 && (
                <Card className="p-4 border-dashed border-2 flex items-center justify-center min-h-[380px]">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-[#0F766E]/10 flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-[#0F766E]" />
                    </div>
                    <p className="text-sm text-[#64748B] mb-4">Add another hostel</p>
                    <select onChange={(e) => e.target.value && addHostel(e.target.value)} className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" defaultValue="">
                      <option value="">Select hostel...</option>
                      {availableHostels.map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </Card>
              )}
            </div>

            {/* Comparison Table */}
            <Card className="overflow-hidden">
              <table className="w-full">
                <tbody>
                  {/* Price */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A] w-48">Monthly Fee</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="text-xl font-semibold text-[#0F172A]">रू {hostel.priceRange.min.toLocaleString()}</div>
                        <div className="text-sm text-[#64748B]">Starting from</div>
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Location</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="flex items-center gap-2 text-[#64748B]">
                          <MapPin className="h-4 w-4" />
                          <span>{hostel.area}, {hostel.city}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Type */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Hostel Type</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <Badge variant="outline">{hostel.type}</Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Room Types */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Room Types</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {hostel.roomTypes.map((type: string) => (
                            <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Vacancy */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Vacancy</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <span className={`font-medium ${hostel.vacantBeds > 5 ? "text-[#16A34A]" : hostel.vacantBeds > 0 ? "text-[#D97706]" : "text-[#DC2626]"}`}>
                          {hostel.vacantBeds} beds available
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Food */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Food Included</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="flex items-center gap-2">
                          {hostel.foodIncluded ? (
                            <Check className="h-5 w-5 text-[#16A34A]" />
                          ) : (
                            <X className="h-5 w-5 text-[#DC2626]" />
                          )}
                          <span className="text-[#64748B]">
                            {hostel.foodIncluded ? `Yes (${hostel.foodScore}/5)` : "No"}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Facilities */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Facilities</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="space-y-2">
                          {hostel.facilities.map((facility: string) => {
                            const Icon = facilityIcons[facility] || Check;
                            return (
                              <div key={facility} className="flex items-center gap-2 text-sm text-[#64748B]">
                                <Icon className="h-4 w-4 text-[#0F766E]" />
                                <span>{facility}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Verification */}
                  <tr className="border-b border-[#E2E8F0]">
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Verification Status</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        {hostel.verified ? (
                          <Badge className="bg-[#0F766E] text-white">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Verified</Badge>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-4 bg-[#F8FAFC] font-medium text-[#0F172A]">Rating</td>
                    {selectedHostels.map((hostel: any) => (
                      <td key={hostel.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                          <span className="font-semibold text-[#0F172A]">{hostel.rating}</span>
                          <span className="text-sm text-[#64748B]">({hostel.totalReviews} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Card>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/hostels")}>Add More Hostels</Button>
              <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90" onClick={() => router.push(`/inquiry?hostelIds=${selectedIds.join(",")}`)}>
                Send Inquiry to Selected
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
