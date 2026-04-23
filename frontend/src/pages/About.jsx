import Badge from "@/components/Badge";
import { Link } from "react-router";

export default function About() {
  return (
    <div className="bg-white">
      <Badge to={"About"} title={"About"}/>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Our BookLy
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We are passionate about books and dedicated to bringing the best reading
          experience to our customers. Discover stories that inspire, educate, and entertain.
        </p>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto py-16 grid md:grid-cols-2 gap-10 items-center px-4">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
          alt="books"
          className="rounded-2xl shadow"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 mb-4">
            Founded with a love for literature, our bookstore started as a small
            collection of curated books. Over time, we have grown into a trusted
            platform for readers worldwide.
          </p>
          <p className="text-gray-600">
            Our mission is simple — connect people with books they love and make
            reading accessible for everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-3xl font-bold">10K+</h3>
            <p className="text-gray-500">Books Available</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-3xl font-bold">5K+</h3>
            <p className="text-gray-500">Happy Customers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-gray-500">Authors</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-3xl font-bold">24/7</h3>
            <p className="text-gray-500">Support</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Meet Our Team
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow p-6 text-center"
            >
              <img
                src={`https://i.pravatar.cc/150?img=${item}`}
                alt="team"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm text-gray-500">Founder</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Start Your Reading Journey Today
        </h2>
        <p className="text-gray-300 mb-6">
          Explore thousands of books and discover your next favorite read.
        </p>
        <Link to="/shop" className="bg-red-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-500">
          Shop Now
        </Link>
      </section>

    </div>
  );
}