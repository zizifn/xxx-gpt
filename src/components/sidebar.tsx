"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const chats = [
  {
    key: 1,
    name: "John Doe",
  },
  {
    key: 2,
    name: "Jane Doe2",
  },
];
export function SideBar() {
  const parentRef = useRef<HTMLDivElement>(null);
  const count = chats.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });
  const items = virtualizer.getVirtualItems();
  return (
    <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-gray-900pt-5 pb-4 w-1/5">
      <nav className="flex h-full flex-col bg-gray-500">
        <a className="mb-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-white/20 py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10">
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New chat
        </a>
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
                    virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                  }
                >
                  <a className="group relative flex cursor-pointer items-center gap-3 break-all rounded-md py-3 px-3 hover:bg-[#e8e9f0] hover:pr-4">
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
                    <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis break-all">
                      {chats[virtualRow.index].name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
