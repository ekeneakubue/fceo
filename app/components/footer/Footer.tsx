"use client";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div>
      <div className="bg-[#0d4811] grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 pt-8 text-[rgb(181,180,180)]">
        <div>
          <div className="py-4">
            <div className="grid place-items-start md:place-items-start">
              <img className="w-[100px] rounded mb-4" src="/images/logo.PNG" alt="footer-logo" />
            </div>
            <h3 className="text-white text-lg mb-2">Subscribe to our Newsletter</h3>
            <label htmlFor="exampleInputEmail1" className="text-[#d6d3d3] text-sm">Email</label>
            &nbsp;
            <input className="block mt-1 text-black bg-gray-50 px-3 py-2 rounded" type="email" id="exampleInputEmail1" aria-describedby="emailHelp" />
            <div className="mt-4 w-[100px] px-2 py-2 rounded border border-[#d6d3d3] text-center text-[#d6d3d3]">Submit</div>
            <br />
            <br />
            <h3 className="text-white text-lg mb-2">Stakeholders</h3>
            <p><a href="#" className="hover:text-white">Ministry of Education</a></p>
            <p><a href="#" className="hover:text-white">TETFund</a></p>
          </div>
        </div>
        <div>
          <div className="py-4">
            <h3 className="text-white text-lg mb-2">General Information</h3>
            <p><a className="hover:text-white" href="/about">About Us</a></p>
            <p><a className="hover:text-white" href="#">International Collaboration</a></p>
            <p><a className="hover:text-white" href="/contact">Contact Us</a></p>
            <p><a className="hover:text-white" href="#">Scholarship</a></p>
            <br />
            <br />
            <h3 className="text-white text-lg mb-2">Careers</h3>
            <p><a className="hover:text-white" href="#">Vacancies</a></p>
            <p><a className="hover:text-white" href="#">Recuitments</a></p>
            <p><a className="hover:text-white" href="#">Awards</a></p>
            <p><a className="hover:text-white" href="#">Events</a></p>
          </div>
        </div>
        <div>
          <div className="py-4">
            <h3 className="text-white text-lg mb-2">Students</h3>
            <p><a className="hover:text-white" href="#">Course Information</a></p>
            <p><a className="hover:text-white" href="#">Academic Calender</a></p>
            <p><a className="hover:text-white" href="#">Technical Services</a></p>
            <p><a className="hover:text-white" href="#">Portal</a></p>
            <br />
            <br />
            <h3 className="text-white text-lg mb-2">News</h3>
            <p><a className="hover:text-white" href="#">Media Highlights</a></p>
            <p><a className="hover:text-white" href="#">Stories</a></p>
            <p><a className="hover:text-white" href="#">Institution Based Research</a></p>
            <p><a className="hover:text-white" href="#">National Research Fund</a></p>
          </div>
        </div>
        <div>
          <div className="py-4">
            <h3 className="text-white text-lg mb-2">Contacts</h3>
            <p>OFEME-OHUHU, PMB 7324, umuahia north LGA, Abia state, Nigeria.</p>
            <p>+234 8085 069 125</p>
            <p>kingsleyezeme1@gmail.com</p>
            <div className="flex gap-4">
              <Link href="/staff-login"> <div className="mt-4 w-[100px] px-2 py-2 rounded border border-[#d6d3d3] text-center text-[#d6d3d3]">Admin</div></Link>
              <Link href="https://wghp7.wghservers.com:2096/webmaillogout.cgi" target="_blank"> <div className="mt-4 w-[100px] px-2 py-2 rounded border border-[#d6d3d3] text-center text-[#d6d3d3]">Webmail</div></Link>
            </div>
            <br />
            
            <h3 className="text-white text-lg mb-2">Alumni</h3>
            <p><a className="hover:text-white" href="#">i-Transcript</a></p>
            <p><a className="hover:text-white" href="#">Campus Life</a></p>
            <p><a className="hover:text-white" href="#">Alumni Update</a></p>
            <p><a className="hover:text-white" href="#">Health Services</a></p>           
          </div>
        </div>
      </div>
      <hr />
      <div className="bg-[#0d4811] grid place-items-center pt-4">
        <hr />
        <div className="text-center text-xs pb-4 text-[rgb(164,162,162)]">
          Copyright 2025 © Federal College of Education, Ofeme Ohuhu. All rights reserved. &nbsp;|&nbsp; Powered by {" "}
          <span>
            <a className="text-white" href="https://expertmediasolution.com/" target="_blank">Expert Media Solutions</a>
          </span>
        </div>
      </div>
    </div>
  );
}


