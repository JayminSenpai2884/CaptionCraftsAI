import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
  BarChartIcon,
  BrainIcon,
  RefreshCcwIcon,
} from "lucide-react";

const features = [
  {
    icon: <TwitterIcon className="w-12 h-12 text-blue-500" />,
    title: "Twitter Thread Generation",
    description: "Create engaging, multi-tweet stories that captivate your audience and boost engagement.",
    benefits: [
      "Generate coherent threads on any topic",
      "Optimize for viral potential",
      "Include relevant hashtags automatically",
    ],
  },
  {
    icon: <InstagramIcon className="w-12 h-12 text-pink-600" />,
    title: "Instagram Caption Crafting",
    description: "Craft compelling captions that complement your visuals and drive interaction.",
    benefits: [
      "Create captions that resonate with your audience",
      "Incorporate trending hashtags",
      "Generate ideas for Instagram Stories and Reels",
    ],
  },
  {
    icon: <LinkedinIcon className="w-12 h-12 text-blue-700" />,
    title: "LinkedIn Post Optimization",
    description: "Develop professional content that establishes your authority and expands your network.",
    benefits: [
      "Write thought leadership articles",
      "Create engaging status updates",
      "Optimize your profile summary",
    ],
  },
  {
    icon: <FileTextIcon className="w-12 h-12 text-gray-700" />,
    title: "Blog Post Ideation",
    description: "Generate ideas and outlines for blog posts that resonate with your target audience.",
    benefits: [
      "Overcome writer's block with AI-generated topics",
      "Create detailed outlines for long-form content",
      "Suggest SEO-friendly titles and headers",
    ],
  },
  {
    icon: <TrendingUpIcon className="w-12 h-12 text-green-600" />,
    title: "Trend Analysis",
    description: "Stay ahead of the curve by identifying and leveraging emerging social media trends.",
    benefits: [
      "Get real-time insights on trending topics",
      "Adapt your content strategy to current events",
      "Predict upcoming trends in your niche",
    ],
  },
  {
    icon: <UsersIcon className="w-12 h-12 text-purple-600" />,
    title: "Audience Targeting",
    description: "Tailor your content to specific audience segments for maximum impact.",
    benefits: [
      "Create persona-specific content",
      "Adjust tone and style for different demographics",
      "Suggest optimal posting times for each platform",
    ],
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-800 pt-6">
          Powerful Features for Social Media Success
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {feature.icon}
                <h2 className="text-2xl font-semibold ml-4 text-gray-800">{feature.title}</h2>
              </div>
              <p className="text-gray-600 mb-6 text-lg">{feature.description}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="text-base">{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-gray-100 py-16 px-4 sm:px-6 rounded-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">Ready to supercharge your social media strategy?</h2>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
            <Link href="/generate">Start Creating Content</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}