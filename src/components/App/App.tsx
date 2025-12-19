import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse} from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);


const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
  queryKey: ["notes", page, debouncedSearch],
  queryFn: () =>
    fetchNotes({
      page,
      perPage: PER_PAGE,
      search: debouncedSearch || undefined,
    }),
  placeholderData: keepPreviousData,
});


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
{isError && <p>Error loading notes</p>}

{data && data.notes.length > 0 && (
  <NoteList notes={data.notes} />
)}


     
      {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm
      onClose={() => setIsModalOpen(false)}
      onCreated={() => setPage(1)}
    />
  </Modal>
)}

    </div>
  );
}
