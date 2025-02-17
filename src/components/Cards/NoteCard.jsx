import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";
import DOMPurify from "dompurify";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite,
  reminderTime,
}) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  const isReminderPassed = reminderTime && new Date(reminderTime) < new Date();

  return (
    <div className="note-card p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 max-h-75 min-h-75 border-l-4 border-blue-500 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900 truncate w-3/4">
          {title}
        </h1>
        <button
          onClick={onToggleFavorite}
          className="text-2xl hover:text-red-500 transition-colors duration-200 cursor-pointer"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="text-gray-700 mt-2 overflow-hidden max-h-24 min-h-20">
        <p
          className="text-sm leading-snug overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render sanitized HTML
        />
      </div>

      <div className="mt-3">
        <span className="text-sm text-gray-600 font-medium">Tags: </span>
        <span className="text-sm text-blue-600 tag">
          {tags && tags.length > 0
            ? tags.map((item) => `#${item}`).join(" ")
            : "No tags"}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <span>{moment(date).format("Do MMM YYYY, h:mm A")}</span>
        {reminderTime && (
          <span
            className={`font-semibold reminder ${
              isReminderPassed ? "line-through text-red-500" : "text-blue-600"
            }`}
          >
            Reminder: {moment(reminderTime).format("Do MMM YYYY, h:mm A")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 gap-2">
        <button
          onClick={onEdit}
          className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors editbtn"
        >
          <MdCreate className="text-lg" />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors editbtn"
        >
          <MdDelete className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
