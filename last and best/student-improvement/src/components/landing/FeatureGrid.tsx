"use client"

export default function FeatureGrid() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base/7 text-gray-400">Active students worldwide</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">15,000+</dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base/7 text-gray-400">Study sessions completed</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">2.4 million</dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base/7 text-gray-400">Average grade improvement</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">23%</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}