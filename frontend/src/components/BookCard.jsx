import React from "react";

const BookCard = ({ title, author, location, img }) => (
  <div className="group flex flex-col gap-4 rounded-lg bg-surface-dark p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg">
      <img
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        src={img}
        alt={`${title} book cover`}
      />
    </div>
    <div className="flex flex-col">
      <h3 className="font-semibold text-text-dark">{title}</h3>
      <p className="text-sm text-subtle-dark">by {author}</p>
      <p className="mt-1 text-sm text-subtle-dark">{location}</p>
      <button className="mt-4 w-full rounded-lg bg-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/30">
        View Details
      </button>
    </div>
  </div>
);

export default BookCard;
