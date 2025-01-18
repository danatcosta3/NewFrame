import React from "react";
import HomeNavBar from "../components/HomeNavBar";
import Footer from "../components/Footer";
function Contact() {
  return (
    <div>
      <HomeNavBar />
      <div className="h-[80vh] flex justify-center flex-col items-center">
        <img src="/images/Mail.png" alt="Mail_Icon" className="w-32" />
        <p className="text-2xl w-[60%] text-center  font-serif mt-6">
          Hi! Thanks for checking out Trey's Movies. If you have any comments,
          questions, or feedback, don't hesitate to send me a message on{" "}
          <a
            href="https://linkedin.com/in/danatcosta3"
            className="text-prim-blue-p hover:underline hover:text-blue-400"
          >
            Linkedin
          </a>
          !
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
