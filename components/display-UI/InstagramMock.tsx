import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface InstagramMockProps {
  content: string;
}

export const InstagramMock: React.FC<InstagramMockProps> = ({ content }) => {
  return (
    <div className="bg-white text-black rounded-lg p-4 max-w-md mx-auto">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
        <p className="font-bold">Mr. Cat😾</p>
      </div>
      <div className="bg-gray-200 h-64 mb-3 flex items-center justify-center">
        <span className="text-gray-500">
          <img className="max-w-[61%] flex justify-center m-auto" src="https://scontent.fyyz1-1.fna.fbcdn.net/v/t39.30808-6/327182711_865339301342557_5716295523859851345_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=LMKizkEqmE4Q7kNvgFs_576&_nc_zt=23&_nc_ht=scontent.fyyz1-1.fna&_nc_gid=AAwTtDf4Wylqhexzu1lfZ_x&oh=00_AYBszAqYtpd3pQ8VSdw0Eub4pjT1Ak-decEiFcxieaDA8Q&oe=67157594"></img>
        </span>
      </div>
      <div className="flex justify-between mb-3">
        <div className="flex space-x-4">
          <Heart size={24} />
          <MessageCircle size={24} />
          <Send size={24} />
        </div>
        <Bookmark size={24} />
      </div>
      <p className="text-sm">{content}</p>
    </div>
  );
};
