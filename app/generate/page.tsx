"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Copy,
  Zap,
  LayoutIcon,
  AlertCircle,
} from "lucide-react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { Navbar } from "@/components/Navbar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  getUserPoints,
  saveGeneratedContent,
  updateUserPoints,
  getGeneratedContentHistory,
  createOrUpdateUser,
} from "@/utils/db/actions";
import { TwitterMock } from "@/components/display-UI/TwitterMock";
import { InstagramMock } from "@/components/display-UI/InstagramMock";
import { LinkedInMock } from "@/components/display-UI/LinkedInMock";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const contentTypes = [
  { value: "twitter", label: "Twitter Thread" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "linkedin", label: "LinkedIn Post" },
];

// const MAX_TWEET_LENGTH = 280;
const POINTS_PER_GENERATION = 1;

interface HistoryItem {
  id: number;
  contentType: string;
  prompt: string;
  content: string;
  createdAt: Date;
}
export default function GenerateContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [contentType, setContentType] = useState(contentTypes[0].value);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchUserPoints = useCallback(async () => {
    if (user?.id) {
      console.log("Fetching points for user:", user.id);
      const points = await getUserPoints(user.id);
      console.log("Fetched points:", points);
      setUserPoints(points);
      if (points === 0) {
        console.log("User has 0 points. Attempting to create/update user.");
        const updatedUser = await createOrUpdateUser(
          user.id,
          user.emailAddresses[0].emailAddress,
          user.fullName || ""
        );
        console.log("Updated user:", updatedUser);
        if (updatedUser) {
          setUserPoints(updatedUser.points);
        }
      }
    }
  }, [user]);

  const fetchContentHistory = useCallback(async () => {
    if (user?.id) {
      const contentHistory = await getGeneratedContentHistory(user.id);
      console.log("Fetched content history:", contentHistory);
      setHistory(contentHistory);
    }
  }, [user]);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchContentHistory();
      fetchUserPoints();
    }
  }, [isSignedIn, user, fetchContentHistory, fetchUserPoints]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGenerate = async () => {
    if (
      !genAI ||
      !user?.id ||
      userPoints === null ||
      userPoints < POINTS_PER_GENERATION
    ) {
      alert("Not enough points or API key not set.");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      let promptText = `Generate ${contentType} content about "${prompt}".`;
      if (contentType === "twitter") {
        promptText +=
          " Provide a thread of 5 tweets, each under 280 characters.";
      }

      let imagePart: Part | null = null;
      if (contentType === "instagram" && image) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              resolve(e.target.result);
            } else {
              resolve("");
            }
          };
          reader.readAsDataURL(image);
        });

        const base64Data = imageData.split(",")[1];
        if (base64Data) {
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: image.type,
            },
          };
        }
        promptText +=
          " Describe the image and incorporate it into the caption.";
      }

      const parts: (string | Part)[] = [promptText];
      if (imagePart) parts.push(imagePart);

      const result = await model.generateContent(parts);
      const generatedText = result.response.text();

      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }

      setGeneratedContent(content);

      // Update points
      const updatedUser = await updateUserPoints(
        user.id,
        -POINTS_PER_GENERATION
      );
      if (updatedUser) {
        setUserPoints(updatedUser.points);
      }

      // Save generated content
      const savedContent = await saveGeneratedContent(
        user.id,
        content.join("\n\n"),
        prompt,
        contentType
      );

      if (savedContent) {
        setHistory((prevHistory) => [savedContent, ...prevHistory]);
        console.log("Updated history:", [savedContent, ...history]);
      } else {
        console.error("Failed to save generated content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied to clipboard!", {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const renderContentMock = () => {
    if (generatedContent.length === 0) return null;

    switch (contentType) {
      case "twitter":
        return <TwitterMock content={generatedContent} />;
      case "instagram":
        return <InstagramMock content={generatedContent[0]} />;
      case "linkedin":
        return <LinkedInMock content={generatedContent[0]} />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to CaptionCraftsAI
          </h1>
          <p className="text-gray-600 mb-8">
            To start generating amazing content, please sign in or create an account.
          </p>
          <SignInButton mode="modal">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
              Sign In / Sign Up
            </Button>
          </SignInButton>
          <p className="text-gray-500 mt-6 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl pt-8 font-bold text-gray-800 mb-12 text-center">
          AI Content Generator
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input section (left side) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Points display */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 transition-all hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <LayoutIcon className="mr-2 h-5 w-5 text-blue-600" />
                Your Points: <span className="ml-2 text-blue-600">{userPoints !== null ? userPoints : "Loading..."}</span>
              </h2>
              <p className="text-gray-600">
                Each generation costs {POINTS_PER_GENERATION} points.
              </p>
            </div>

            {/* Content generation form */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 transition-all hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Zap className="mr-2 h-6 w-6 text-blue-600" />
                Create New Content
              </h2>
              <div className="mb-6">
                <Select
                  value={contentType}
                  onValueChange={(value) => setContentType(value)}
                >
                  <SelectTrigger className="w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-800">
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-gray-100">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="w-full h-32 mb-6 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              
              {contentType === "instagram" && (
                <div className="mb-6">
                  <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (optional)
                  </label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated content section (right side) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 min-h-[500px] transition-all hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <LayoutIcon className="mr-2 h-6 w-6 text-blue-600" />
                Generated Content
              </h2>
              {generatedContent.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {renderContentMock()}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => copyToClipboard(generatedContent.join("\n\n"))}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors shadow-sm flex items-center"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-semibold mb-2">No content generated yet</p>
                  <p className="mb-4">Use the form on the left to create your first piece of content!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-left"/>
    </div>
  );
}
