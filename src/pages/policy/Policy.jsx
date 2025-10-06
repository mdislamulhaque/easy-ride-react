import React from "react";
import { Link } from "react-router";

export default function Policy() {
  return (
    <div>
      <section
        className="relative h-64 bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg-home1-2.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0"></div>

        {/* Text */}
        <h1 className="relative text-3xl md:text-4xl font-bold text-white z-10">
          Privacy Policy
        </h1>
      </section>

      <section className=" text-gray-900 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Privacy Policy
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Who we are
              </h3>
              <p className="text-gray-800 text-sm">
                Our website address is:{" "}
                <Link to={"https://easyride.cm"} className="text-red-700">
                  https://easyride.cm
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                What personal data we collect and why we collect it
              </h3>
              <h4 className="text-lg font-medium text-gray-800 mt-4">
                Comments
              </h4>
              <p className="text-gray-800 text-sm">
                When visitors leave comments, we collect the data shown in the
                form, the IP address, and browser user agent string to help spam
                detection. An anonymized string created from your email may be
                provided to the Gravatar service. The Gravatar service privacy
                policy is available at
                <a
                  href="https://automattic.com/privacy/"
                  className="text-red-700 ml-1 underline"
                >
                  Automattic Privacy Policy
                </a>
                . After approval, your profile picture is visible publicly with
                your comment.
              </p>

              <h4 className="text-lg font-medium text-gray-900 mt-4">Media</h4>
              <p className="text-gray-800 text-sm">
                If you upload images, avoid including embedded location data
                (EXIF GPS). Visitors can download and extract location data from
                uploaded images.
              </p>

              <h4 className="text-lg font-medium text-gray-900 mt-4">
                Contact forms
              </h4>

              <h4 className="text-lg font-medium text-gray-900 mt-4">
                Cookies
              </h4>
              <p className="text-gray-800 text-sm">
                If you leave a comment, you may opt-in to saving your name,
                email, and website in cookies for convenience. These last one
                year. Temporary cookies check browser acceptance on login pages.
                Login and screen option cookies last up to 2 days and 1 year
                respectively. Selecting “Remember Me” extends login to 2 weeks.
                Logout removes cookies. Editing or publishing an article adds a
                cookie with the post ID (expires in 1 day).
              </p>

              <h4 className="text-lg font-medium text-gray-900 mt-4">
                Embedded content from other websites
              </h4>
              <p className="text-gray-800 text-sm">
                Articles may include embedded content (videos, images,
                articles). These act as if you visited the third-party website,
                which may collect data, use cookies, or track interactions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">
                Who we share your data with
              </h3>
              <p className="text-gray-800 text-sm">
                If you request a password reset, your IP address will be
                included in the reset email.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                How long we retain your data
              </h3>
              <p className="text-gray-800 text-sm">
                Comments and metadata are retained indefinitely for recognition
                and approval of follow-up comments. For registered users, we
                store provided personal info in their profile. Users may edit or
                delete their information anytime (except username). Admins can
                also see and edit that data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                What rights you have over your data
              </h3>
              <p className="text-gray-800 text-sm">
                If you have an account or left comments, you may request an
                export of your personal data or request its deletion. This
                excludes data kept for legal, security, or administrative
                reasons.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Where we send your data
              </h3>
              <p className="text-gray-800 text-sm">
                Visitor comments may be checked through automated spam detection
                services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Your contact information
              </h3>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                Additional information
              </h3>
              <ul className="list-disc pl-6 text-gray-800 text-sm space-y-2">
                <li>How we protect your data</li>
                <li>What data breach procedures we have in place</li>
                <li>What third parties we receive data from</li>
                <li>
                  What automated decision making and/or profiling we do with
                  user data
                </li>
                <li>Industry regulatory disclosure requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
