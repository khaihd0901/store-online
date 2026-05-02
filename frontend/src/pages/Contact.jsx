import React from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import Badge from "@/components/Badge";

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Form Values", values);
      toast.success("Your message has been sent successfully!");
      resetForm();
    },
  });

  return (
    <div className="bg-white">
      <Badge to={"Contact"} title={"Contact"}/>

      {/* Contact Info and Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Contact Information</h2>
              <p className="text-gray-500 mb-10 max-w-lg">
                Tortor dignissim convallis aenean et tortor at risus viverra adipiscing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="font-bold mb-3">Head Office</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    730 Glenstone Ave 65802, Springfield, US
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    +123 987 321, +123 123 654
                  </p>
                  <a href="mailto:headbranch@yourcompany.com" className="text-gray-500 text-sm hover:text-red-500 transition-colors">
                    headbranch@yourcompany.com
                  </a>
                </div>
                <div>
                  <h3 className="font-bold mb-3">Branch Office</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    730 Glenstone Ave 65802, Springfield, US
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">
                    +123 987 321, +123 123 654
                  </p>
                  <a href="mailto:contactbranch@yourcompany.com" className="text-gray-500 text-sm hover:text-red-500 transition-colors">
                    contactbranch@yourcompany.com
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Social info</h3>
                <div className="flex space-x-4">
                  {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((social) => (
                    <a 
                      key={social} 
                      href="#" 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5 fill-current">
                        <use xlinkHref={`#${social}`}></use>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Got Any Questions?</h2>
              <p className="text-gray-500 mb-8">
                Use the form below to get in touch with us.
              </p>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Write Your Name Here"
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition-all ${
                        formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your E-mail*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Write Your Email Here"
                      className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition-all ${
                        formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition-all"
                    {...formik.getFieldProps("phone")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Write Your Subject Here"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition-all"
                    {...formik.getFieldProps("subject")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Message*</label>
                  <textarea
                    rows="5"
                    name="message"
                    placeholder="Write Your Message Here"
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 transition-all resize-none ${
                        formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-200'
                      }`}
                    {...formik.getFieldProps("message")}
                  ></textarea>
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-4 rounded-md transition-colors uppercase tracking-widest text-sm"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
