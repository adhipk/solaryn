import { useState } from "react"
import Image from "next/image"
import { ChevronRight, Twitter, Instagram, Facebook, Youtube } from "lucide-react"
import type { ProfileData } from "~/types/profile"

export default function ProfileLayout({
  profileImage,
  name,
  socialStats,
  details,
  additionalInfo,
}: ProfileData) {
  const [isFollowing, setIsFollowing] = useState(false)

  const renderDetailValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return (
        <div className="text-sm">
          <ul className="list-disc pl-5 space-y-1">
            {value.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="text-[#1ec7fa] mt-1 text-sm">Read More</div>
        </div>
      )
    }
    return <div className="text-sm">{value}</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative mb-20">
      {/* Profile Image */}
      <div className="px-4">
        <div className="aspect-[3/4] w-full relative mb-4">
          <Image src={profileImage} alt="Profile" fill className="object-cover" />
        </div>
      </div>

      {/* Profile Name and Follow Button */}
      <div className="flex justify-between items-center px-4 mb-6">
        <h1 className="text-xl font-medium">{name}</h1>
        <button
          className={`rounded-full px-4 py-1 text-xs ${isFollowing ? "bg-gray-200 text-black" : "bg-[#1ec7fa] text-white"}`}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* Social Stats */}
      <div className="flex justify-between px-4 mb-4">
        {socialStats.twitter && (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-sm">{socialStats.twitter}</span>
            <Twitter className="w-4 h-4 mt-1" />
          </div>
        )}
        {socialStats.instagram && (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-sm">{socialStats.instagram}</span>
            <Instagram className="w-4 h-4 mt-1" />
          </div>
        )}
        {socialStats.facebook && (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-sm">{socialStats.facebook}</span>
            <Facebook className="w-4 h-4 mt-1" />
          </div>
        )}
        {socialStats.youtube && (
          <div className="flex flex-col items-center">
            <span className="font-semibold text-sm">{socialStats.youtube}</span>
            <Youtube className="w-4 h-4 mt-1" />
          </div>
        )}
      </div>

      {/* Submit Product Button */}
      <div className="px-4 mb-6">
        <button className="bg-[#1ec7fa] text-white rounded-md py-2 w-full flex justify-between items-center px-4">
          <span>Submit Your Product</span>
          <div className="border border-white w-5 h-5 flex items-center justify-center">
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Basic Details Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-medium mb-2">Details</h2>
        {details.map((detail, index) => (
          <div key={index} className="bg-[#1a1a1a] text-white p-3 rounded-md mb-2">
            <div className="mb-1 font-medium text-xs">{detail.key.toUpperCase()}</div>
            {renderDetailValue(detail.value)}
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-medium mb-2">Additional Information</h2>
        {additionalInfo.map((info, index) => (
          <div key={index} className="bg-[#1a1a1a] text-white p-3 rounded-md mb-2">
            <div className="mb-1 font-medium text-xs">{info.key.toUpperCase()}</div>
            {renderDetailValue(info.value)}
          </div>
        ))}
      </div>
    </div>
  )
} 