"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FormEvent, useRef } from "react";
import { Fragment, useState } from "react";
import {
  FaceSmileIcon as FaceSmileIconOutline,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import {
  FaceFrownIcon,
  FaceSmileIcon as FaceSmileIconMini,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  MicrophoneIcon,
  StopIcon,
  XCircleIcon,
  PencilSquareIcon,
  NoSymbolIcon
} from "@heroicons/react/20/solid";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import ReactMarkdown from "react-markdown";
import { Ma_Shan_Zheng } from "next/font/google";

const isGeneratePicture = (prompt: string) => {
  return `does this sentence ${prompt} mean the user wants to a picture or art? Please only answer YES or NO with json format.`;
};
const categoryPicture = (prompt: string) => {
  return `If sentences like "could you generate art picture" will fall into the category "Image".
If sentences like "could you generate a poem" will fall into the category "Poem".
What sentences like "${prompt}" should fall into? Please only choose one of "Image","Poem","others" in JSON format like {"category":""} without other words.`;
};

type ChatMessage = {
  role: "assistant" | "user" | "system";
  content: string;
  isUrl?: boolean;
  mode: UserMode;
};
type UserMode = "image" | "chat" | "exit";
const chatMessagesAtom = atom<ChatMessage[]>([
  {
    role: "system",
    content: "You are a helpful assistant.",
    mode: "chat",
  },
]);
const audioURLAtom = atom<string>("");

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Chats() {
  const chatMessages = useAtomValue(chatMessagesAtom);
  const [editImgesIndex, setEditImgesIndex] = useState(-1);
  const parentRef = useRef<HTMLDivElement>(null);
  const count = chatMessages.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });
  const items = virtualizer.getVirtualItems();
  return (
    <div className="flex w-4/5 min-w-fit flex-grow flex-col">
      <div
        ref={parentRef}
        className="List"
        style={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          contain: "strict",
        }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${items[0].start}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={
                  virtualRow.index % 2
                    ? "group w-full border-b border-black/10 text-gray-800 dark:border-gray-900/50 dark:bg-gray-800 dark:text-gray-100"
                    : "group w-full border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100"
                }
              >
                <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                  <div className="group relative flex w-full cursor-pointer items-center gap-3 break-all rounded-md py-3 px-3 hover:bg-[#e8e9f0] hover:pr-4">
                    {chatMessages[virtualRow.index].role !== "assistant" ? (
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    ) : (
                      <svg
                        width="41"
                        height="41"
                        viewBox="0 0 41 41"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        strokeWidth={1.5}
                        className="h-6 w-6"
                      >
                        <path
                          d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    )}
                    <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                      {chatMessages[virtualRow.index].isUrl ? (
                        <>
                          <img
                            src={chatMessages[virtualRow.index].content}
                            alt=""
                          />
                          <div>
                            <div className="flex h-6 items-center">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-900"
                              >
                                Edit Image
                              </label>
                              <input
                                id="comments"
                                aria-describedby="comments-description"
                                name="comments"
                                type="checkbox"
                                onChange={(e) => {
                                  setEditImgesIndex(virtualRow.index);
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <ReactMarkdown>
                          {chatMessages[virtualRow.index].content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatBox editImgesIndex={editImgesIndex}></ChatBox>
      <Footer></Footer>
    </div>
  );
}
const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIconMini,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
];
function base64ImagetoBlob(base64: string) {
  var binary = atob(base64);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

function ChatBox({ editImgesIndex }: { editImgesIndex: number }) {
  const setChatMessages = useSetAtom(chatMessagesAtom);
  const chatMessages = useAtomValue(chatMessagesAtom);
  const [selected, setSelected] = useState(moods[4]);
  const [chatText, setChatText] = useState("");
  const [userMode, setUserMode] = useState<UserMode>("chat");

  async function sendChat(event: FormEvent) {
    if (!chatText) return;
    event.preventDefault();
    let messages: ChatMessage[] = [];
    let userintent = "";
    if (chatText.startsWith("/exit")) {
      setChatMessages((oldChatMessages: ChatMessage[]) => {
        messages = [
          ...oldChatMessages,
          {
            role: "assistant",
            content: "exit custom mode, return to chat mode",
              mode: 'exit'
          },
        ];
        return [...messages];
      });
      setUserMode("chat");
      setChatText("");
      return;
    }
    if (chatText.startsWith("/mode")) {
      const userIntentResp = await fetch("api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: categoryPicture(
                chatText.substring(chatText.indexOf("/mode"))
              ),
            },
          ],
        }),
      });

      if (userIntentResp.ok) {
        const intentJSON = await userIntentResp.json();
        console.log(JSON.parse(intentJSON.choices[0]?.message?.content));
        userintent = JSON.parse(
          intentJSON.choices[0]?.message?.content
        ).category;
      }
      if (userintent.toLocaleLowerCase() === "image") {
        setChatMessages((oldChatMessages: ChatMessage[]) => {
          messages = [
            ...oldChatMessages,
            {
              role: "user",
              content: chatText,
              mode:'image'
            },
            {
              role: "assistant",
              content:
                "switch to image mode, you can now use word to gerneate image",
                mode:'image'
            },
          ];
          return [...messages];
        });
        console.log("images mode");
        setUserMode("image");
        setChatText("");
        return;
      }
    }

    setChatMessages((oldChatMessages: ChatMessage[]) => {
      messages = [
        ...oldChatMessages,
        {
          role: "user",
          content: chatText,
          mode: userMode
        },
      ];
      return [...messages];
    });

    console.log(chatMessages);
    if (userMode === "image") {
      const imagesResp = await fetch("api/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: chatText,
          n: 1,
          size: "512x512",
          response_format: "url",
          user: "zizi",
        }),
      });
      if (imagesResp.ok) {
        const imagesJSON = await imagesResp.json();
        console.log(imagesJSON);

        const responseMessage = imagesJSON.data[0]?.url;
        setChatText("");
        setChatMessages((oldChatMessages) => [
          ...oldChatMessages,
          {
            role: "assistant",
            content: responseMessage,
            isUrl: true,
            mode: 'image'
          },
        ]);
      }
    } else {
    const chatResp = await fetch("api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages.filter(msg => msg.mode === 'chat').map((msg) => ({ role: msg.role, content: msg.content }))
      }),
    });
    if (chatResp.ok) {
      const chatData = await chatResp.json();
      setChatText("");
      console.log(chatData);
      const responseMessage = chatData.choices[0]?.message;
      setChatMessages((oldChatMessages) => [
        ...oldChatMessages,
        {
          ...responseMessage,
          mode: userMode
        },
      ]);
    }
  }
  }

  return (
    <>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            className="inline-block h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <form action="#" onSubmit={(event) => sendChat(event)}>
            <div className="border-b border-gray-200 focus-within:border-indigo-600">
              <label htmlFor="comment" className="sr-only">
                彦祖请说话！
              </label>
              <textarea
                rows={3}
                name="comment"
                id="comment"
                className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="彦祖请说话..."
                value={chatText}
                onChange={(e) => {
                  console.log("onChange", e.target.value);
                  setChatText(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-between pt-2 flex-wrap">
              <div className="flex items-center space-x-5">
                <div className="flow-root">
                  <ReacordAduio setAudioText={setChatText}></ReacordAduio>
                </div>
                <div className="flow-root">
                  <EditUserText chatText={chatText} setChatText={setChatText}></EditUserText>
                </div>
                <div className="flow-root">
                <ModerationsText chatText={chatText} setChatText={setChatText}></ModerationsText>
                </div>
                
              </div>
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function ModerationsText(
  {
    chatText,
    setChatText
  }:{chatText: string,
    setChatText:(text:string)=>void,
  }
){

  async function moderationsText(){
    if(!chatText) return;
    const moderationsResp = await fetch("api/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-moderation-latest",
        input: chatText,
      }),
    });
    if (moderationsResp.ok) {
      const moderationsData = await moderationsResp.json();
      const flagged = moderationsData.results[0].flagged;
      if(flagged){
       alert("your text is not allowed");
      }

    }
  }

  return (
    <button
    type="button"
    className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
  onClick={moderationsText}
  >
    <NoSymbolIcon
      className="h-6 w-6 text-yellow-500"
      aria-hidden="true"
    />
    <span className="sr-only">moderations</span>
  </button>
  )
}

function EditUserText(
  {
    chatText,
    setChatText
  }:{chatText: string,
    setChatText:(text:string)=>void,
  }
){

  async function editText(){
    if(!chatText) return;
    const editsResp = await fetch("api/v1/edits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-davinci-edit-001",
        input: chatText,
        instruction: 'Fix the spelling mistakes and grammar errors.',
        n: 1,
        temperature: 0.2
      }),
    });
    if (editsResp.ok) {
      const chatData = await editsResp.json();
      const responseMessage = chatData.choices[0]?.text;
      console.log(chatData);
      setChatText(responseMessage);

    }
  }

  return (
    <button
    type="button"
    className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
  onClick={editText}
  >
    <PencilSquareIcon
      className="h-6 w-6 text-red-500"
      aria-hidden="true"
    />
    <span className="sr-only">Edit</span>
  </button>
  )
}

function Footer() {
  return (
    <>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        <a
          href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          ChatGPT gpt-3.5-turbo model
        </a>
        . Free Research Preview. Our goal is to make AI systems more natural and
        safe to interact with. Your feedback will help us improve.
      </div>
    </>
  );
}

function ReacordAduio({
  setAudioText,
}: {
  setAudioText: (text: string) => void;
}) {
  const [audioUrl, setAudioURL] = useAtom(audioURLAtom);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  // const [audioBlob, setAudioChunks] = useState<Blob| null>(null);
  async function startRecording() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setStream(mediaStream);
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "audio/webm",
    });
    setRecorder(mediaRecorder);

    mediaRecorder.start();
    console.log("startRecording-----", mediaRecorder);
    console.log(mediaRecorder.state);
    setRecordingStatus(true);
    let localAudioChunks: any[] = [];
    mediaRecorder.ondataavailable = function (event) {
      console.log("ondataavailable-----");
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    mediaRecorder.onerror = function (event) {
      console.log(event);
    };
    setAudioChunks(localAudioChunks);
  }

  function sopRecording() {
    if (recorder === null) return;
    setRecordingStatus(false);
    recorder.stop();

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      translations(audioBlob);

      setAudioURL(audioUrl);
      setAudioChunks([]);
    };
  }

  async function translations(audioBlob: Blob) {
    let formData = new FormData();
    formData.append("file", audioBlob, "flie.webm");
    formData.append("model", "whisper-1");
    formData.append("prompt", "Translates chinese into into English.");

    const translationsResp = await fetch("api/v1/audio/translations", {
      method: "POST",
      headers: {},
      body: formData,
    });
    if (translationsResp.ok) {
      const translationsJson = await translationsResp.json();
      console.log(translations);
      const responseMessage = translationsJson.text;
      console.log(responseMessage);
      setAudioText(responseMessage);
    }
  }

  return (
    <div className="flex items-center">
      {!recordingStatus ? (
        <button
          type="button"
          className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
          onClick={startRecording}
        >
          <MicrophoneIcon
            className="h-6 w-6 text-green-400"
            aria-hidden="true"
          />
          <span className="sr-only">Microphone</span>
        </button>
      ) : (
        <button
          type="button"
          className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
          onClick={sopRecording}
        >
          <StopIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
          <span className="sr-only">Stop Microphone</span>
        </button>
      )}
      {audioUrl ? (
        <div className="flex h-10 w-[150px]">
          <audio src={audioUrl} className="h-10" controls></audio>
          <button
            type="button"
            className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setAudioURL("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
