const BookCard = ({ book }) => {
  return (
    <div className="bg-[#161b22] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#00B4D8]">{book.title}</h3>
        <p className="text-gray-400">{book.author}</p>
        <p className="text-gray-500 text-sm">
          {book.category} • {book.location}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
