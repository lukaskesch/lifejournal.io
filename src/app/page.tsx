"use client";
import Link from "next/link";
import FeatureCard from "@/components/ui/FeatureCard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-primary/90 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Life Journal
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-100">
            {/* Become your best self */}
            Build better habits, log your activities and journal on your life&apos;s journey.
            {/* Journal on your life&apos;s journey by logging your activities, building better habits and journaling. */}
          </p>
          {/* {!session && (
            <Link
              href="/api/auth/signin"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started
            </Link>
          )} */}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Your Toolkit for Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Activity Tracking"
              description="Log and monitor your daily activities with ease. Keep track of time spent on what matters most."
              icon="⏱️"
            />
            <FeatureCard
              title="Daily Journaling"
              description="Reflect on your day with guided prompts. Build a meaningful record of your thoughts and experiences."
              icon="📝"
            />
            <FeatureCard
              title="Habit Building"
              description="Create and maintain positive habits. Track your progress and stay motivated."
              icon="✅"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Start Your Journey Today
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Be the person who takes control of their personal growth and development. Join many others today!
          </p>
          {!session && (
            <Link
              href="/api/auth/signin"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
