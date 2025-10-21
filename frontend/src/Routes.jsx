import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./components/BookDetail";
import ChatPage from "./pages/ChatPage";
import ConversationsPage from "./pages/ConversationsPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/chat" element={<ConversationsPage />} />
      <Route path="/chat/:recipientId" element={<ChatPage />} />
    </Routes>
  );
};

export default AppRoutes;
