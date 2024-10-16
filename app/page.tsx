import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
  ClockIcon,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800 overflow-hidden">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Section */}
        <div className="text-center py-24 lg:py-36 relative">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 pt-12">
            AI-Powered Content Creation Tool
          </h1>
          <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
            Effortlessly generate engaging content for your social media channels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              asChild
              className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/generate">Start Creating</Link>
            </Button>
            <Button
              asChild
              className="bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-10 py-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24" id="features">
          <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">
            Enhance Your Social Media Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Twitter Threads",
                icon: <TwitterIcon className="w-12 h-12 mb-6 text-blue-600" />,
                description:
                  "Create engaging Twitter threads that capture attention and increase visibility.",
              },
              {
                title: "Instagram Captions",
                icon: (
                  <InstagramIcon className="w-12 h-12 mb-6 text-pink-500" />
                ),
                description:
                  "Craft catchy captions for your Instagram posts to drive engagement.",
              },
              {
                title: "LinkedIn Posts",
                icon: <LinkedinIcon className="w-12 h-12 mb-6 text-blue-700" />,
                description:
                  "Develop professional content for your LinkedIn audience.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl my-24 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">
              Why Choose Our Content Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {[
                { text: "Save time and effort in content creation", icon: <ClockIcon /> },
                { text: "Produce consistent and high-quality posts", icon: <CheckCircleIcon /> },
                { text: "Boost engagement across all platforms", icon: <TrendingUpIcon /> },
                { text: "Stay updated with social media trends", icon: <SparklesIcon /> },
                { text: "Tailor content to fit your brand voice", icon: <ZapIcon /> },
                { text: "Effortlessly scale your social media strategy", icon: <RocketIcon /> },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
                  <div className="text-gray-800">{benefit.icon}</div>
                  <span className="text-gray-700 text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-24 relative">
          <h2 className="text-5xl font-bold mb-10 text-gray-800">
            Ready to transform your social media strategy?
          </h2>
          {userId ? (
            <Button
              asChild
              className="bg-gray-800 hover:bg-gray-700 text-white px-12 py-5 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Link href="/generate">
                Generate Content Now
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <Button className="bg-gray-800 hover:bg-gray-700 text-white px-12 py-5 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105">
                Get Started Free
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </Button>
            </SignUpButton>
          )}
          <p className="mt-6 text-gray-500 text-lg">No credit card required (Test Mode😉)</p>
        </div>
      </main>
    </div>
  );
}
