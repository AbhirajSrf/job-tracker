import { useState, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationDetail from "./components/ApplicationDetail";
import ConfirmDialog from "./components/ConfirmDialog";
import Modal from "./components/Modal";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import Toast from "./components/Toast";
import useDebounce from "./hooks/useDebounce";
import * as api from "./api/applications";
import "./App.css";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'view' | 'delete' | null
  const [activeApplication, setActiveApplication] = useState(null);
  const [toast, setToast] = useState(null);

  async function fetchApplications(pageOverride) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listApplications({
        status,
        search: debouncedSearch,
        page: pageOverride ?? page,
        limit: 8,
      });
      setApplications(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    fetchApplications(page);
  }, [page, status, debouncedSearch]);

  function showToast(message, tone = "success") {
    setToast({ message, tone });
  }

  function closeModal() {
    setModal(null);
    setActiveApplication(null);
  }

  async function handleCreate(payload) {
    const result = await api.createApplication(payload);
    setApplications((prev) => [result.data, ...prev]);
    showToast(`Added ${result.data.company_name} to your tracker.`);
    closeModal();
    fetchApplications();
  }

  async function handleUpdate(payload) {
    const id = activeApplication.id;
    const result = await api.updateApplication(id, payload);
    setApplications((prev) => prev.map((a) => (a.id === id ? result.data : a)));
    showToast(`Updated ${result.data.company_name}.`);
    closeModal();
  }

  async function handleDelete() {
    const target = activeApplication;
    // Optimistic UI update: remove immediately, roll back on failure.
    setApplications((prev) => prev.filter((a) => a.id !== target.id));
    closeModal();
    try {
      await api.deleteApplication(target.id);
      showToast(`Removed ${target.company_name}.`, "success");
      fetchApplications();
    } catch (err) {
      setApplications((prev) => [target, ...prev]);
      showToast(err.message || "Could not delete. Please try again.", "error");
    }
  }

  const hasFilters = status !== "" || search.trim() !== "";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Job Application Tracker</h1>
          <p className="app-header__subtitle">
            Every application, interview, and offer — in one place.
          </p>
        </div>
        {pagination.total > 0 && (
          <div className="app-header__count">{pagination.total} total</div>
        )}
      </header>

      <FilterBar
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
        onAddNew={() => setModal("add")}
      />

      {loading && <div className="state-message">Loading applications…</div>}

      {!loading && error && (
        <div className="state-message state-message--error">
          {error}
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => fetchApplications()}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          hasFilters={hasFilters}
          onAddNew={() => setModal("add")}
          onClearFilters={() => {
            setStatus("");
            setSearch("");
          }}
        />
      )}

      {!loading && !error && applications.length > 0 && (
        <>
          <div className="app-list">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onView={(a) => {
                  setActiveApplication(a);
                  setModal("view");
                }}
                onEdit={(a) => {
                  setActiveApplication(a);
                  setModal("edit");
                }}
                onDelete={(a) => {
                  setActiveApplication(a);
                  setModal("delete");
                }}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {modal === "add" && (
        <Modal title="Add application" onClose={closeModal}>
          <ApplicationForm
            onSubmit={handleCreate}
            onCancel={closeModal}
            submitLabel="Add application"
          />
        </Modal>
      )}

      {modal === "edit" && activeApplication && (
        <Modal title="Edit application" onClose={closeModal}>
          <ApplicationForm
            key={activeApplication.id}
            initialData={activeApplication}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            submitLabel="Save changes"
          />
        </Modal>
      )}

      {modal === "view" && activeApplication && (
        <Modal title="Application details" onClose={closeModal}>
          <ApplicationDetail
            application={activeApplication}
            onClose={closeModal}
            onEdit={(a) => {
              setActiveApplication(a);
              setModal("edit");
            }}
          />
        </Modal>
      )}

      {modal === "delete" && activeApplication && (
        <Modal title="Delete application" onClose={closeModal}>
          <ConfirmDialog
            message={`Delete the application for ${activeApplication.job_title} at ${activeApplication.company_name}? This can't be undone.`}
            onConfirm={handleDelete}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {toast && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
