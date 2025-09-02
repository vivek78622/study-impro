"use client"

import * as React from "react"

export default function SplineViewer({ url, className = "" }: { url: string; className?: string }) {
  const [error, setError] = React.useState(false)
  
  return (
    <>
      {error ? (
        <div className={`${className} w-full h-full rounded-xl border border-[#D2B48C]/40 flex items-center justify-center bg-gray-50`}>
          <p className="text-gray-500">Failed to load content</p>
        </div>
      ) : (
        <iframe
          src={url}
          className={`${className} w-full h-full rounded-xl border border-[#D2B48C]/40`}
          loading="lazy"
          allow="autoplay; fullscreen"
          onError={() => setError(true)}
        />
      )}
    </>
  )
}


