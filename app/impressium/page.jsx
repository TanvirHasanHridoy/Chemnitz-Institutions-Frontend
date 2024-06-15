"use client";
import React from "react";

const Impressum = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-4">Impressum</h1>
        <p className="text-lg mb-4">
          Welcome to the Impressum page. Here you will find the legal
          information about our website.
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Company Information</h2>
          <p className="text-lg">
            Company Name: Your Company
            <br />
            Address: 1234 Street, City, Country
            <br />
            Email: contact@yourcompany.com
            <br />
            Phone: +123 456 7890
            <br />
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Legal Disclaimer</h2>
          <p className="text-lg">
            All information provided on this website is for informational
            purposes only and does not constitute a legal contract between us
            and any person or entity unless otherwise specified. Information on
            this website is subject to change without prior notice.
          </p>
        </section>
        {/* Add more sections as needed */}
      </main>
      <footer className="p-4 bg-blue-900 text-white text-center">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default Impressum;
