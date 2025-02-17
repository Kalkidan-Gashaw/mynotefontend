import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useSnackbar } from "notistack";
import notification from "../../components/notificationsound/alert.wav";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import DOMPurify from "dompurify"; // Import DOMPurify

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [reminderTime, setReminderTime] = useState(
    formatDateForInput(noteData?.reminderTime) || ""
  );
  const [error, setError] = useState(null);
  const [reminderTimer, setReminderTimer] = useState(null);

  function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Trim off milliseconds and 'Z'
  }

  const playSound = () => {
    const audio = new Audio(notification);
    audio.play();
  };

  const addNewNote = async () => {
    try {
      const sanitizedContent = DOMPurify.sanitize(content); // Sanitize content here
      const response = await axiosInstance.post("/add-note", {
        title,
        content: sanitizedContent,
        tags,
        reminderTime,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        enqueueSnackbar("Note added successfully!", { variant: "success" });
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error adding note");
      enqueueSnackbar(error.response?.data?.message || "Error adding note", {
        variant: "error",
      });
    }
  };

  const editNote = async () => {
    try {
      const sanitizedContent = DOMPurify.sanitize(content); // Sanitize content here
      const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content: sanitizedContent,
        tags,
        reminderTime,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        enqueueSnackbar("Note updated successfully!", { variant: "success" });
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating note");
      enqueueSnackbar(error.response?.data?.message || "Error updating note", {
        variant: "error",
      });
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  useEffect(() => {
    if (reminderTimer) {
      clearTimeout(reminderTimer); // Clear previous reminder timer
    }

    if (reminderTime) {
      const reminderDate = new Date(reminderTime);
      const currentTime = new Date();
      const timeDifference = reminderDate - currentTime;

      if (timeDifference > 0) {
        const timer = setTimeout(() => {
          enqueueSnackbar(`Reminder: ${title}`, { variant: "info" });
          playSound();
        }, timeDifference);
        setReminderTimer(timer);
      }
    }

    return () => {
      if (reminderTimer) clearTimeout(reminderTimer);
    };
  }, [reminderTime, title, enqueueSnackbar]);

  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTags(noteData.tags || []);
      setReminderTime(formatDateForInput(noteData.reminderTime) || "");
    }
  }, [noteData]);

  const handleSetReminder = () => {
    if (!reminderTime) {
      setError("Please set a reminder time.");
      return;
    }
    enqueueSnackbar(
      `Reminder set for: ${new Date(reminderTime).toLocaleString()}`,
      { variant: "success" }
    );
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none modalinput"
          placeholder="Add your title here"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <Editor
          apiKey="jrndxe97oalaqy10s5l7k20unj46ewd48s120k6gw71aoru9" // Replace with your actual API key
          value={content}
          init={{
            height: 300,
            menubar: false,
            directionality: "ltr",
            plugins: ["link image code", "lists"],
            toolbar:
              "undo redo | styles | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
          }}
          onEditorChange={(newContent) => setContent(newContent)} // Update content on change
        />
        <div className="mt-3">
          <label className="input-label">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        <div className="mt-3 flex items-center">
          <label className="input-label flex items-center">
            <FaClock className="mr-2 text-gray-600" />
          </label>
          <input
            type="datetime-local"
            className="text-slate-950 outline-none modalinput flex-grow"
            value={reminderTime}
            onChange={({ target }) => setReminderTime(target.value)}
          />
          <button className="ml-2 btn-primary w-10" onClick={handleSetReminder}>
            Set
          </button>
        </div>
        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button
          className="btn-primary font-medium mt-5 p-3"
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
